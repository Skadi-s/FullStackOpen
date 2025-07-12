import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import AuthForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import UsersPage from './components/UsersPage'
import UserManagement from './components/UserManagement'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'
import { logoutUser } from './reducers/userReducer'

const App = () => {
  const [activeTab, setActiveTab] = useState('blogs')
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.user.currentUser)

  useEffect(() => {
    dispatch(initializeUser())
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logoutUser())
    setActiveTab('blogs')
  }

  const NavigationTabs = () => {
    if (!currentUser) return null

    return (
      <div style={{ 
        borderBottom: '2px solid #dee2e6',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex' }}>
            <button
              onClick={() => setActiveTab('blogs')}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: activeTab === 'blogs' ? '#007bff' : 'transparent',
                color: activeTab === 'blogs' ? 'white' : '#007bff',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginRight: '5px'
              }}
            >
              📝 Blogs
            </button>
            <button
              onClick={() => setActiveTab('users')}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: activeTab === 'users' ? '#007bff' : 'transparent',
                color: activeTab === 'users' ? 'white' : '#007bff',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginRight: '5px'
              }}
            >
              👥 Users
            </button>
            <button
              onClick={() => setActiveTab('management')}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: activeTab === 'management' ? '#007bff' : 'transparent',
                color: activeTab === 'management' ? 'white' : '#007bff',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🔧 Management
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: '#666' }}>
              Welcome, <strong>{currentUser.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          color: '#007bff', 
          fontSize: '2.5rem',
          margin: '0 0 10px 0'
        }}>
          🔗 Blog Application
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Share your thoughts and discover amazing blogs
        </p>
      </header>
      
      <Notification />
      
      {!currentUser ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          marginTop: '50px'
        }}>
          <div style={{ 
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            width: '100%'
          }}>
            <AuthForm />
          </div>
        </div>
      ) : (
        <>
          <NavigationTabs />
          
          {activeTab === 'blogs' && (
            <div>
              <BlogForm />
              <BlogList />
            </div>
          )}
          
          {activeTab === 'users' && <UsersPage />}
          
          {activeTab === 'management' && <UserManagement />}
        </>
      )}
    </div>
  )
}

export default App
