import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useMessageDispatch } from '../MessageContext'
import blogService from '../services/blogs'
import { useUserValue } from '../UserContext'
import { BrowserRouter as Router, NavLink } from 'react-router-dom'

let available = false

const Blog = ({ blog }) => {
  const user = useUserValue()
  let available = blog.user.id === user.id

  const queryClient = useQueryClient()
  const dispatch = useMessageDispatch()

  const removeBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      dispatch({
        type: 'SUCCESS',
        payload: { content: `Blog "${blog.title}" was removed` },
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

  if (!blog || !user) {
    return null
  }

  const handleRemove = (event) => {
    event.preventDefault()
    if (confirm(`Remove blog "${blog.title}"?`)) {
      removeBlogMutation.mutate(blog.id)
    }
  }

  if (available) {
    return (
      <div id='blog' className='blog-row'>
        <NavLink className='blog-item user-link link' to={`/blogs/${blog.id}`}>
          {blog.title}{' '}
        </NavLink>
        <span className='blog-item user-author'>by {blog.author}</span>
        <span className='blog-item user-likes'>{blog.likes} likes</span>
        <button
          id='remove-button'
          className='btn btn-remove blog-item user-remove'
          onClick={handleRemove}
        >
          remove
        </button>
      </div>
    )
  } else {
    return (
      <div className='blog-row'>
        <NavLink className='blog-item blog-link link' to={`/blogs/${blog.id}`}>
          {blog.title}{' '}
        </NavLink>
        <span className='blog-item blog-author'>by {blog.author}</span>
        <span className='blog-item blog-likes'>{blog.likes} likes</span>
      </div>
    )
  }
}

export default Blog
