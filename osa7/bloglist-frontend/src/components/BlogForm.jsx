import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { create } from '../services/blogs'
import { useMessageDispatch } from '../MessageContext'
/* import { errorMessage } from '../utils/errorMessage' */

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const querryClient = useQueryClient()
  const dispatch = useMessageDispatch()

  const newBlogMutation = useMutation({
    mutationFn: create,
    onSuccess: ({ title }) => {
      querryClient.invalidateQueries({ queryKey: ['users'] })
      querryClient.invalidateQueries({ queryKey: ['blogs'] })
      dispatch({
        type: 'SUCCESS',
        payload: { content: `A new blog "${title}" was added` },
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

  const addBlog = (event) => {
    event.preventDefault()
    newBlogMutation.mutate({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div className='create-blog'>
      <h2>Create a New Blog</h2>
      <form onSubmit={addBlog}>
        <div className='form-group'>
          <label>Title</label>
          <input
            id='title'
            type='text'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div className='form-group'>
          <label>Author</label>
          <input
            id='author'
            type='text'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div className='form-group'>
          <label>Url</label>
          <input
            id='url'
            type='text'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button id='create-button' className='btn btn-create' type='submit'>
          Create
        </button>
      </form>
    </div>
  )
}

export default BlogForm
