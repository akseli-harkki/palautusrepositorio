const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async(request, response) => {
  const body = request.body
  const user = await request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogsRouter.put('/:id', userExtractor, async(request, response) => {
  const body = request.body


  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' }).populate('user', { username: 1, name: 1, id: 1 })
  response.status(201).json(updatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async(request, response) => {
  const deletedBlog = await Blog.findById(request.params.id)
  const user = await request.user

  if (deletedBlog.user.toString() !== user.id) {
    return response.status(401).json({ error: 'cannot delete another user`s blog' })
  }
  user.blogs = user.blogs.filter(b => b.toString() !== deletedBlog.id.toString() )

  await user.save()
  await Blog.findByIdAndRemove(request.params.id)

  response.status(204).end()
})

module.exports = blogsRouter