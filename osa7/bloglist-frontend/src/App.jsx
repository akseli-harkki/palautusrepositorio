import { useState, useEffect, useRef } from 'react'
import SingleBlog from './components/SingleBlog'
import blogService from './services/blogs'
import userService from './services/users'
import Notification from './components/Notification'
import Loginform from './components/Loginform'
import DisplayUsers from './components/DisplayUsers'
import { useMessageDispatch } from './MessageContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUserDispatch, useUserValue } from './UserContext'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from 'react-router-dom'
import User from './components/User'
import SimpleBlogView from './components/SimpleBlogView'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [users, setUsers] = useState([])

  const user = useUserValue()
  const userDispatch = useUserDispatch()

  const messagDispatch = useMessageDispatch()
  const queryClient = useQueryClient()

  const resultBlog = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: false,
  })

  useEffect(() => {
    if (resultBlog.isSuccess) {
      setBlogs(resultBlog.data.sort((a, b) => b.likes - a.likes))
    }
  }, [resultBlog])

  const resultUser = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers,
    retry: false,
  })

  useEffect(() => {
    if (resultUser.isSuccess) {
      setUsers(resultUser.data.sort((a, b) => b.blogs.length - a.blogs.length))
    }
  }, [resultUser])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET', payload: user })
      blogService.setToken(user.token)
    }
  }, [])

  const updateBlogMutation = useMutation({
    mutationFn: blogService.put,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: (error) => {
      if (error.response.data.error) {
        messagDispatch({
          type: 'ERROR',
          payload: { content: error.response.data.error },
        })
      } else {
        messagDispatch({ type: 'ERROR', payload: { content: error.message } })
      }
    },
  })

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({ type: 'SET', payload: null })
  }

  return (
    <Router>
      <div>
        <Notification />
        {!user && <Loginform />}
        {user && (
          <div>
            <nav className='navBar'>
              <NavLink className='navLink' to='/'>
                Blogs
              </NavLink>
              <NavLink className='navLink' to='/users'>
                Users
              </NavLink>
              <div className='user-container'>
                <span className='user-info'>{user.name}</span>
                <button
                  className='user-info btn'
                  id='logout-button'
                  onClick={logout}
                >
                  logout
                </button>
              </div>
            </nav>
            <Routes>
              <Route path='/' element={<SimpleBlogView blogs={blogs} />} />
              <Route path='/users' element={<DisplayUsers users={users} />} />
              <Route path='/users/:id' element={<User blogs={blogs} />} />
              <Route
                path='/blogs/:id'
                element={
                  <SingleBlog blogs={blogs} update={updateBlogMutation} />
                }
              />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  )
}

export default App
