import { useMemo } from 'react'
import { useSelector } from 'react-redux'

const CurrentUserInfo = () => {
  const currentUser = useSelector(state => state.user.currentUser)
  const blogs = useSelector(state => state.blogs)
  
  const userStats = useMemo(() => {
    if (!currentUser) return null

    const userBlogs = blogs.filter(blog => 
      blog.user && (blog.user.id === currentUser.id || blog.user.username === currentUser.username)
    )
    
    const totalLikes = userBlogs.reduce((sum, blog) => sum + blog.likes, 0)
    const avgLikes = userBlogs.length > 0 ? (totalLikes / userBlogs.length).toFixed(1) : 0
    const mostLikedBlog = userBlogs.length > 0 ? 
      userBlogs.reduce((prev, current) => prev.likes > current.likes ? prev : current) : null

    return {
      userBlogs,
      totalLikes,
      avgLikes,
      mostLikedBlog
    }
  }, [currentUser, blogs])
  
  if (!currentUser || !userStats) {
    return null
  }

  return (
    <div style={{ 
      backgroundColor: '#f0f8ff', 
      padding: '20px', 
      borderRadius: '10px',
      marginBottom: '20px',
      border: '2px solid #007bff'
    }}>
      <h3>📊 Your Dashboard</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            {userStats.userBlogs.length}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Total Blogs</div>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
            {userStats.totalLikes}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Total Likes</div>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
            {userStats.avgLikes}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Average Likes</div>
        </div>
      </div>

      {userStats.mostLikedBlog && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>
            🏆 Your Most Popular Blog
          </h4>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {userStats.mostLikedBlog.title}
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            by {userStats.mostLikedBlog.author} • {userStats.mostLikedBlog.likes} likes
          </div>
        </div>
      )}

      <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        Welcome back, <strong>{currentUser.name}</strong>! 👋
      </div>
    </div>
  )
}

export default CurrentUserInfo
