import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { create } from '../services/comments'
import { useMessageDispatch } from '../MessageContext'
import { BrowserRouter as Router, Link, useParams } from 'react-router-dom'

const SingleBlog = ({ blogs, update }) => {
  const [comment, setComment] = useState('')
  const querryClient = useQueryClient()
  const dispatch = useMessageDispatch()
  const id = useParams().id
  const blog = blogs.find((n) => n.id === id)

  const newCommentMutation = useMutation({
    mutationFn: create,
    onSuccess: () => {
      querryClient.invalidateQueries({ queryKey: ['blogs'] })
      dispatch({
        type: 'SUCCESS',
        payload: { content: 'A new comment was added' },
      })
    },
    onError: (error) => {
      if (error.response.data.error) {
        dispatch({
          type: 'ERROR',
          payload: { content: error.response.data.error },
        })
      } else {
        dispatch({ type: 'ERROR', payload: { content: error.message } })
      }
    },
  })

  if (!blog) {
    return null
  }

  const addComment = (event) => {
    event.preventDefault()
    const commentObject = { comment: comment }
    newCommentMutation.mutate({ commentObject, id })
    setComment('')
  }

  const handleLike = (event) => {
    event.preventDefault()
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    update.mutate({ newObject: newBlog, id: blog.id })
  }

  return (
    <div className='container'>
      <h1 className='page-header'>{blog.title}</h1>
      <h1 className='page-header'>by {blog.author}</h1>
      <div className='content'>
        <Link className='link' to={blog.url}>
          {' '}
          {blog.url}{' '}
        </Link>
        <br />
        {blog.likes} likes{' '}
        <button
          id='like-button'
          className='btn btn-create'
          onClick={handleLike}
        >
          like
        </button>
        <br />
        Added by {blog.user.name}
        <br />
      </div>

      <h2>Comments</h2>
      <form onSubmit={addComment}>
        <div>
          <input
            id='comment'
            type='text'
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </div>
        <button id='create-button' className='btn btn-create' type='submit'>
          Add comment
        </button>
      </form>
      <ul>
        {blog.comments.map((n) => (
          <li key={n.id}>{n.comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default SingleBlog
