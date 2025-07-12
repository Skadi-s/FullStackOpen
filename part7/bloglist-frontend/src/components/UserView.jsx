import { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import UserDetail from './UserDetail'
import { initializeUsers } from '../reducers/usersReducer'
import { getUserStats } from '../utils/userStats'

const UserView = () => {
  const [selectedUserId, setSelectedUserId] = useState(null)
  const dispatch = useDispatch()
  const { users, isLoading } = useSelector(state => state.users)
  const currentUser = useSelector(state => state.user.currentUser)
  const blogs = useSelector(state => state.blogs)

  const handleRefresh = () => {
    dispatch(initializeUsers())
  }

  // 使用 useMemo 来优化统计计算
  const usersWithStats = useMemo(() => {
    return users.map(user => {
      const stats = getUserStats(user, blogs)
      return {
        ...user,
        stats: {
          blogCount: stats.blogCount,
          totalLikes: stats.totalLikes
        }
      }
    })
  }, [users, blogs])

  if (!currentUser) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Please log in to view user information</h2>
      </div>
    )
  }

  if (isLoading) {
    return <div>Loading users...</div>
  }

  if (selectedUserId) {
    return (
      <div>
        <button 
          onClick={() => setSelectedUserId(null)}
          style={{
            marginBottom: '20px',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back to Users
        </button>
        <UserDetail userId={selectedUserId} />
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>👥 All Users</h2>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {isLoading ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Click on a user to view their detailed information and blogs. Stats update automatically when blogs change.
      </p>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {usersWithStats.map(user => (
          <div 
            key={user.id}
            onClick={() => setSelectedUserId(user.id)}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: user.id === currentUser.id ? '#f0f8ff' : 'white'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>
                  {user.name}
                  {user.id === currentUser.id && (
                    <span style={{ 
                      fontSize: '12px', 
                      backgroundColor: '#007bff', 
                      color: 'white', 
                      padding: '2px 6px', 
                      borderRadius: '12px',
                      marginLeft: '10px'
                    }}>
                      You
                    </span>
                  )}
                </h3>
                <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                  @{user.username}
                </p>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                  {user.stats.blogCount} blogs
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {user.stats.totalLikes} total likes
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {usersWithStats.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px', 
          color: '#666',
          fontStyle: 'italic'
        }}>
          No users found.
        </div>
      )}
    </div>
  )
}

export default UserView
