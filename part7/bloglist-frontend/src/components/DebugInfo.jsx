import { useSelector } from 'react-redux'

const DebugInfo = () => {
  const users = useSelector(state => state.users.users)
  const blogs = useSelector(state => state.blogs)
  const currentUser = useSelector(state => state.user.currentUser)

  if (!currentUser) return null

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      backgroundColor: '#333', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 1000
    }}>
      <div>Users: {users.length}</div>
      <div>Blogs: {blogs.length}</div>
      <div>Last update: {new Date().toLocaleTimeString()}</div>
    </div>
  )
}

export default DebugInfo
