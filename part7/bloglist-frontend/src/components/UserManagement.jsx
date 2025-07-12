import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import userService from '../services/userService'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'
import { initializeUsers } from '../reducers/usersReducer'
import DatabaseReset from './DatabaseReset'
import { getUserBlogCount } from '../utils/userStats'

const UserManagement = () => {
  const dispatch = useDispatch()
  const { users } = useSelector(state => state.users)
  const currentUser = useSelector(state => state.user.currentUser)
  const blogs = useSelector(state => state.blogs)
  const [deletingUserId, setDeletingUserId] = useState(null)

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This will also delete all their blogs.`)) {
      return
    }

    try {
      setDeletingUserId(userId)
      await userService.remove(userId)
      dispatch(setNotificationWithTimeout(`User "${userName}" deleted successfully`, 5000))
      dispatch(initializeUsers())
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete user'
      dispatch(setNotificationWithTimeout(errorMessage, 5000))
    } finally {
      setDeletingUserId(null)
    }
  }

  const getUserBlogCountForUser = (userId) => {
    const user = users.find(u => u.id === userId)
    return getUserBlogCount(user, blogs)
  }

  return (
    <div>
      <h3>👥 User Management</h3>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Manage all users in the system. Be careful when deleting users as this will also delete all their blogs.
      </p>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                User Info
              </th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>
                Blogs
              </th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>
                Status
              </th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const blogCount = getUserBlogCountForUser(user.id)
              const isCurrentUser = currentUser && user.id === currentUser.id
              const hasIncompleteData = !user.name || user.name.trim() === ''
              
              return (
                <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>
                    <div>
                      <div style={{ 
                        fontWeight: 'bold', 
                        color: hasIncompleteData ? '#dc3545' : '#333'
                      }}>
                        {user.name || 'No Name Provided'}
                        {isCurrentUser && (
                          <span style={{
                            fontSize: '12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '12px',
                            marginLeft: '8px'
                          }}>
                            You
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        @{user.username}
                      </div>
                      {hasIncompleteData && (
                        <div style={{ fontSize: '12px', color: '#dc3545', marginTop: '2px' }}>
                          ⚠️ Incomplete profile
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <span style={{
                      backgroundColor: blogCount > 0 ? '#e7f3ff' : '#f8f9fa',
                      color: blogCount > 0 ? '#007bff' : '#666',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {blogCount}
                    </span>
                  </td>
                  
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    {hasIncompleteData ? (
                      <span style={{
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        Incomplete
                      </span>
                    ) : (
                      <span style={{
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        Complete
                      </span>
                    )}
                  </td>
                  
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    {!isCurrentUser && (
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name || user.username)}
                        disabled={deletingUserId === user.id}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        {deletingUserId === user.id ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                    {isCurrentUser && (
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        Current User
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {users.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          No users found.
        </div>
      )}
      
      <DatabaseReset />
    </div>
  )
}

export default UserManagement
