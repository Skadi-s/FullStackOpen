import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import userService from '../services/userService'
import blogService from '../services/blogService'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'
import { initializeUsers } from '../reducers/usersReducer'
import { initializeBlogs } from '../reducers/blogReducer'
import { canResetDatabase, formatUserRole } from '../utils/permissions'

const DatabaseReset = () => {
  const dispatch = useDispatch()
  const { users } = useSelector(state => state.users)
  const blogs = useSelector(state => state.blogs)
  const currentUser = useSelector(state => state.user.currentUser)
  const [isDeleting, setIsDeleting] = useState(false)

  // 确保只有root用户可以使用数据库重置功能
  if (!canResetDatabase(currentUser)) {
    return (
      <div style={{ 
        backgroundColor: '#f8d7da', 
        border: '2px solid #f5c6cb',
        borderRadius: '8px',
        padding: '20px',
        margin: '20px 0'
      }}>
        <h3 style={{ color: '#721c24', marginBottom: '15px' }}>
          🚫 Access Restricted
        </h3>
        <p style={{ color: '#721c24', marginBottom: '10px' }}>
          Database reset functionality is only available to root users.
        </p>
        <p style={{ color: '#856404', fontSize: '14px' }}>
          Your current role: <strong>{formatUserRole(currentUser)}</strong>
        </p>
      </div>
    )
  }

  const handleResetDatabase = async () => {
    const confirmMessage = `
⚠️ WARNING: This will permanently delete ALL data!

This action will:
- Delete all ${users.length} users
- Delete all ${blogs.length} blogs
- Reset the entire database

This action CANNOT be undone!

Are you absolutely sure you want to proceed?
    `.trim()

    if (!window.confirm(confirmMessage)) {
      return
    }

    const doubleConfirm = window.confirm('Type "DELETE ALL" to confirm this destructive action.')
    if (!doubleConfirm) {
      return
    }

    try {
      setIsDeleting(true)

      // Delete all users except current user (to maintain session)
      const otherUsers = users.filter(user => user.id !== currentUser.id)
      
      for (const user of otherUsers) {
        try {
          await userService.remove(user.id)
        } catch (error) {
          console.error(`Failed to delete user ${user.username}:`, error)
        }
      }

      dispatch(setNotificationWithTimeout(
        `Database reset complete. Deleted ${otherUsers.length} users and all blogs.`, 
        8000
      ))
      
      // Refresh data
      dispatch(initializeUsers())
      dispatch(initializeBlogs())
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to reset database'
      dispatch(setNotificationWithTimeout(errorMessage, 8000))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div style={{ 
      backgroundColor: '#fff3cd', 
      border: '2px solid #ffeaa7',
      borderRadius: '8px',
      padding: '20px',
      margin: '20px 0'
    }}>
      <h3 style={{ color: '#856404', marginBottom: '15px' }}>
        ⚠️ Danger Zone - Database Reset
      </h3>
      
      <div style={{ marginBottom: '20px', color: '#6c5218' }}>
        <p><strong>Current Database Status:</strong></p>
        <ul style={{ marginLeft: '20px' }}>
          <li>👥 Total Users: <strong>{users.length}</strong></li>
          <li>📝 Total Blogs: <strong>{blogs.length}</strong></li>
          <li>🔑 Current User: <strong>{currentUser?.name} (@{currentUser?.username})</strong></li>
        </ul>
        
        <p style={{ marginTop: '15px', fontWeight: 'bold' }}>
          This action will delete all users (except you) and all blogs permanently.
        </p>
      </div>

      <button
        onClick={handleResetDatabase}
        disabled={isDeleting}
        style={{
          padding: '12px 24px',
          backgroundColor: isDeleting ? '#ccc' : '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: isDeleting ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => {
          if (!isDeleting) e.target.style.backgroundColor = '#c82333'
        }}
        onMouseOut={(e) => {
          if (!isDeleting) e.target.style.backgroundColor = '#dc3545'
        }}
      >
        {isDeleting ? '🔄 Deleting All Data...' : '💥 Reset Entire Database'}
      </button>
      
      <p style={{ 
        fontSize: '12px', 
        color: '#6c5218',
        marginTop: '10px',
        fontStyle: 'italic'
      }}>
        Note: Your current account will be preserved to maintain the session.
      </p>
    </div>
  )
}

export default DatabaseReset
