import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Notification from './components/Notification'
import Navigation from './components/Navigation'
import BlogList from './components/BlogList'
import AuthForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import UsersPage from './components/UsersPage'
import UserManagement from './components/UserManagement'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'
import { logoutUser } from './reducers/userReducer'
import { canAccessManagement, formatUserRole } from './utils/permissions'

const App = () => {
  const [activeTab, setActiveTab] = useState('blogs')
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.user.currentUser)

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  // 只有当用户登录后才获取博客数据，只有root用户登录后才获取用户数据
  useEffect(() => {
    if (currentUser) {
      dispatch(initializeBlogs())
      
      // 只有root用户才能获取用户列表
      if (canAccessManagement(currentUser)) {
        dispatch(initializeUsers())
      }
    }
  }, [dispatch, currentUser])

  return (
    <div>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {!currentUser && (
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
        )}
        
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
            {activeTab === 'blogs' && (
              <div>
                <BlogForm />
                <BlogList />
              </div>
            )}
            
            {activeTab === 'users' && <UsersPage />}
            
            {activeTab === 'management' && canAccessManagement(currentUser) && <UserManagement />}
            
            {activeTab === 'management' && !canAccessManagement(currentUser) && (
              <div style={{
                textAlign: 'center',
                padding: '50px',
                backgroundColor: '#f8d7da',
                borderRadius: '10px',
                margin: '20px 0'
              }}>
                <h2 style={{ color: '#721c24' }}>🚫 Access Denied</h2>
                <p style={{ color: '#721c24', fontSize: '18px', marginBottom: '15px' }}>
                  Only root users can access the management system.
                </p>
                <p style={{ color: '#856404', fontSize: '14px' }}>
                  Your current role: <strong>{formatUserRole(currentUser)}</strong>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App
