import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Loginform from './components/Loginform'
import DisplayBlogs from './components/DisplayBlogs'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  },[message])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async(event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      if(error.response.data.error) {
        setMessage([error.response.data.error, 'error'])
      } else{
        setMessage([error.message, 'error'])
      }
    }
  }

  const handleCreation = async(blogObject) => {
    try {
      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response))
      setMessage([`A new blog "${blogObject.title}" was added`, 'success'])
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      if(error.response.data.error) {
        setMessage([error.response.data.error, 'error'])
      } else{
        setMessage([error.message, 'error'])
      }
    }
  }

  const update = async(blogObject, id) => {
    try {
      const response = await blogService.put(blogObject, id)
      setBlogs(blogs.map(n => n.id === id ? response : n))
    } catch (error) {
      if(error.response.data.error) {
        setMessage([error.response.data.error, 'error'])
      } else{
        setMessage([error.message, 'error'])
      }
    }
  }

  const remove = async(blog) => {
    if(confirm(`Remove blog "${blog.title}"?`)) {
      try {
        const response = await blogService.remove(blog.id)
        setMessage([`Blog "${blog.title}" was removed`, 'success'])
        setBlogs(blogs.filter(n => n.id !== blog.id))
      } catch (error) {
        if(error.response.data.error) {
          setMessage([error.response.data.error, 'error'])
        } else{
          setMessage([error.message, 'error'])
        }
      }
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  return (
    <div>
      <Notification message={message} setMessage={setMessage}/>
      {!user &&
        <Loginform handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword} />
      }
      {user &&
      <div>
        <div>
          {user.name} logged in
          <button id='logout-button' onClick={logout}>logout</button>
        </div>
        <Togglable buttonLabelOpen="New Blog" buttonLabelClose="Cancel" ref={blogFormRef}>
          <BlogForm handleCreation={handleCreation} />
        </Togglable>
        <DisplayBlogs blogs={blogs}
          update={update}
          user={user}
          remove={remove} />
      </div>
      }
    </div>
  )
}

export default App