
import { useState } from 'react'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

const Blog = ({ blog , update, user, remove }) => {
  const [view, setView] = useState('view')
  let available = blog.user.id === user.id
  const showWhenAvailable = { display: available ? '' : 'none' }
  const showExtraInfo = { display: view === 'hide'? '' : 'none' }

  const handleLike = (event) => {
    event.preventDefault()
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    update(newBlog, blog.id)
  }

  const handleRemove = (event) => {
    event.preventDefault()
    remove(blog)
  }

  const handleView = (event) => {
    event.preventDefault()
    setView(view === 'view' ? 'hide' : 'view')
  }

  return (
    <div id='blog' style={blogStyle}>
      {blog.title} {blog.author} <button onClick={handleView}>{view}</button><br />
      <div style={showExtraInfo} className="extraInfo" data-testid="info">
        {blog.url} <br />
        likes {blog.likes} <button id='like-button' onClick={handleLike}>like</button><br />
        {blog.user.name}
        <div style={showWhenAvailable}>
          <button id='remove-button' onClick={handleRemove}>remove</button><br />
        </div>
      </div>
    </div>
  )
}



export default Blog