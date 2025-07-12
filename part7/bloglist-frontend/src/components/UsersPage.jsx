import { useSelector } from 'react-redux'
import CurrentUserInfo from './CurrentUserInfo'
import UserView from './UserView'

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

  return (
    <div>
      <CurrentUserInfo />
      <UserView />
    </div>
  )
}

export default UsersPage
