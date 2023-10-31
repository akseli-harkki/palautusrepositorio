import Blog from './Blog'
import { BrowserRouter as Router, useParams } from 'react-router-dom'

const User = ({ blogs }) => {
  const id = useParams().id
  const usersBlogs = blogs.filter((n) => n.user.id === id)
  if (!usersBlogs) {
    return null
  }

  return (
    <div className='container'>
      <h1 className='page-header'>{usersBlogs[0].user.name}</h1>
      <h2 className='content-header'>Added Blogs</h2>
      <div>
        {usersBlogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  )
}

export default User
