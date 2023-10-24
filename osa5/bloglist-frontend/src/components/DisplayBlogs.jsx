import Blog from './Blog'
import Togglable from './Togglable'

const DisplayBlogs = ({ blogs, update, user, remove }) => (
  <div>
    <h2>Blogs</h2>
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} update={update} user={user} remove={remove} />
    )}
  </div>
)

export default DisplayBlogs