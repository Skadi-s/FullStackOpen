import { useSelector } from 'react-redux'
import CurrentUserInfo from './CurrentUserInfo'
import UserView from './UserView'
import { canAccessManagement, formatUserRole } from '../utils/permissions'

const UsersPage = () => {
  const currentUser = useSelector(state => state.user.currentUser)

  if (!currentUser) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        margin: '20px 0'
      }}>
        <h2>👋 Welcome to Blog App</h2>
        <p style={{ color: '#666', fontSize: '18px' }}>
          Please log in to view user information and manage your blogs.
        </p>
      </div>
    )
  }

  // 只有root用户可以查看所有用户信息
  if (!canAccessManagement(currentUser)) {
    return (
      <div>
        <CurrentUserInfo />
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: '#fff3cd',
          borderRadius: '10px',
          margin: '20px 0',
          border: '2px solid #ffeaa7'
        }}>
          <h3 style={{ color: '#856404', marginBottom: '15px' }}>👥 User Directory</h3>
          <p style={{ color: '#856404', fontSize: '16px', marginBottom: '10px' }}>
            User directory access is restricted to administrators.
          </p>
          <p style={{ color: '#856404', fontSize: '14px' }}>
            Your current role: <strong>{formatUserRole(currentUser)}</strong>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <CurrentUserInfo />
      <UserView />
    </div>
  )
}

export default UsersPage
