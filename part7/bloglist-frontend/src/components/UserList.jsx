import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeUsers } from '../reducers/usersReducer'

const UserList = () => {
  const dispatch = useDispatch()
  const { users, isLoading, error } = useSelector(state => state.users)
  const blogs = useSelector(state => state.blogs)

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  // 计算每个用户的博客数量
  const getUserBlogCount = (userId) => {
    return blogs.filter(blog => blog.user && blog.user.id === userId).length
  }

  if (isLoading) {
    return <div>Loading users...</div>
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>
  }

  return (
    <div>
      <h2>Users</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>User</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>
                <div>
                  <strong>{user.name}</strong>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    @{user.username}
                  </div>
                </div>
              </td>
              <td style={{ padding: '10px' }}>
                {getUserBlogCount(user.id)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {users.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
          No users found.
        </p>
      )}
    </div>
  )
}

export default UserList
