const typeDefs = `#graphql
  type Book {
    title: String
    published: Int
    author: Author
    id: ID
    genres: [String]
  }

  type Author {
    name: String
    id: ID
    born: Int
    bookCount: Int
    books: [Book]
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
    bookCount: Int
    allBooks(author: String, genres: [String]): [Book] 
    authorCount: Int
    allAuthors: [Author]
    me: User
  }

  type Mutation {
    addBook(
      title: String
      published: Int
      author: String
      id: ID
      genres: [String]
    ): Book
    addAuthor(
      name: String
      id: ID
      born: Int
      bookCount: Int
    ): Author
    editAuthor(
      name: String
      setBornTo: Int
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

module.exports = typeDefs