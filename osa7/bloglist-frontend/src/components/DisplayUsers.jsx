import { BrowserRouter as Router, Link } from 'react-router-dom'

const DisplayUsers = ({ users }) => {
  return (
    <div className='container'>
      <h1 className='page-header'>Users</h1>
      <table className='table'>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link className='link' to={`/users/${user.id}`}>
                  {user.name}
                </Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DisplayUsers
