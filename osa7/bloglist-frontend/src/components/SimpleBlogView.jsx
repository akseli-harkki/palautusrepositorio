import { useRef } from 'react'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { BrowserRouter as Router, NavLink } from 'react-router-dom'

const SimpleBlogView = ({ blogs }) => {
  const blogFormRef = useRef()

  return (
    <div className='container'>
      <h1 className='page-header'>Blogs</h1>
      <Togglable
        className='togglable'
        buttonLabelOpen='New Blog'
        buttonLabelClose='Cancel'
        ref={blogFormRef}
      >
        <BlogForm />
      </Togglable>
      {blogs.map((blog) => (
        <div key={blog.id} className='blog-row'>
          <NavLink
            className='blog-item blog-link link'
            to={`/blogs/${blog.id}`}
          >
            {blog.title}{' '}
          </NavLink>
          <span className='blog-item blog-author'>by {blog.author}</span>
          <span className='blog-item blog-likes'>{blog.likes} likes</span>
        </div>
      ))}
    </div>
  )
}

export default SimpleBlogView
