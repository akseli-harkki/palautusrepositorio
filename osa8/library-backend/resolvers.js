const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async() => Author.collection.countDocuments(),
    allAuthors: async() => Author.find({}),
    allBooks: async(root, args) => {
      if (args.author && args.genres) {
        const author = await Author.find({ name: args.author })
        return Book.find({ author: author[0].id, genres: { $all: args.genres } }).populate('author', { name: 1, born: 1 })
      } else if(args.author) {
        const author = await Author.find({ name: args.author })
        return Book.find({ author: author[0].id }).populate('author', { name: 1, born: 1 })
      } else if(args.genres) {
        return Book.find({ genres: { $all: args.genres } }).populate('author', { name: 1, born: 1 })
      } else {
        return Book.find({}).populate('author', { name: 1, born: 1 })
      }
    },
    me: (root, args, context) => {
      const currentUser = context.currentUser
      return currentUser
    }
  },
  Author: {
    bookCount: async (root) => root.books.length  
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const authorArray = await Author.find({ name: args.author}).exec()
      let author = authorArray[0]

      if(!author) {
        const newAuthor = new Author({ name: args.author })       

        try {
          const book =  new Book({ ...args, author:newAuthor.id })
          newAuthor.books = [book.id]
          // tarkistetaan ensin kirja oikeellisuus, jotta ei jouduta tilanteeseen, jossa
          // kirjan lisäys hylätään, mutta tekijä on jo ehditty lisätä
          let error = book.validateSync()
          if (book.validateSync()) {
            throw new GraphQLError('Saving book failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.title,
                error
              }
            })
          }
          
          await newAuthor.save() 
          await book.save()
          pubsub.publish('BOOK_ADDED', {bookAdded: book.populate('author', {name: 1 })})
          return book.populate('author', {name: 1 })
        } catch (error) {
          throw new GraphQLError('Saving book failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }             
      }

      const book =  new Book({ ...args, author:author.id })
      

      try {
        let error = book.validateSync()
        if (book.validateSync()) {
          throw new GraphQLError('Saving book failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
              error
            }
          })
        }
        author.books = author.books.concat(book.id)
      
        await author.save()  
        await book.save() 
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }   
      pubsub.publish('BOOK_ADDED', {bookAdded: book.populate('author', {name: 1 })})
      return book.populate('author', {name: 1 })
    },

    addAuthor: async (root, args) => {
      const author = new Author({ ...args })
      try {
        await author.save() 
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }  
      return author
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      let updatedAuthor = undefined
      try {
        updatedAuthor = await Author.findOneAndUpdate({ name: args.name}, { born: args.setBornTo }, {new: true, runValidators: true})
      } catch (error) {
        throw new GraphQLError('Setting birth year failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
            error
          }
        })
      } 
      
      return updatedAuthor
    },

    createUser: async (root, args) => {
      const user = new User({ ...args })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'salasana123' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
}


module.exports = resolvers