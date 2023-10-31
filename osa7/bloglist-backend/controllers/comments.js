const commentRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')

commentRouter.post('/:id/comments', async(request, response) => {
  const commentedBlog = await Blog.findById(request.params.id)
  const body = request.body

  const comment = new Comment({
    comment: body.comment
  })

  const result = await comment.save()
  commentedBlog.comments = commentedBlog.comments.concat(result._id)
  await commentedBlog.save()

  response.status(201).json(result)
})

module.exports = commentRouter