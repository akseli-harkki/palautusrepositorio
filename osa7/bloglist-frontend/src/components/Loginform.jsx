import { useMessageDispatch } from '../MessageContext'
import { useUserDispatch } from '../UserContext'
import { useState } from 'react'
import blogService from '../services/blogs'
import loginService from '../services/login'

const Loginform = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const messageDispatch = useMessageDispatch()
  const userDispatch = useUserDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      userDispatch({ type: 'SET', payload: user })
      setUsername('')
      setPassword('')
    } catch (error) {
      if (error.response.data.error) {
        messageDispatch({
          type: 'ERROR',
          payload: { content: error.response.data.error },
        })
      } else {
        messageDispatch({ type: 'ERROR', payload: { content: error.message } })
      }
    }
  }

  return (
    <div className='login-container'>
      <h2 className='login-title'>Log in to the Blog Application</h2>
      <form onSubmit={handleLogin}>
        <div className='form-group'>
          <label>Username</label>
          <input
            type='text'
            value={username}
            id='username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div className='form-group'>
          <label>password</label>
          <input
            type='password'
            value={password}
            id='password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login-button' type='submit'>
          login
        </button>
      </form>
    </div>
  )
}

export default Loginform
