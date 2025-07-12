import { useSelector } from 'react-redux'

const UserDetail = ({ userId }) => {
  const users = useSelector(state => state.users.users)
  const blogs = useSelector(state => state.blogs)
  
  const user = users.find(u => u.id === userId)
  const userBlogs = blogs.filter(blog => blog.user && blog.user.id === userId)

  if (!user) {
    return <div>User not found</div>
  }

  const totalLikes = userBlogs.reduce((sum, blog) => sum + blog.likes, 0)
  const avgLikes = userBlogs.length > 0 ? (totalLikes / userBlogs.length).toFixed(1) : 0

  return (
    <div>
      <h2>{user.name}</h2>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>User Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <strong>Name:</strong> {user.name}
          </div>
          <div>
            <strong>Username:</strong> @{user.username}
          </div>
          <div>
            <strong>Total Blogs:</strong> {userBlogs.length}
          </div>
          <div>
            <strong>Total Likes:</strong> {totalLikes}
          </div>
          <div>
            <strong>Average Likes:</strong> {avgLikes}
          </div>
          <div>
            <strong>Member Since:</strong> {user.dateCreated ? new Date(user.dateCreated).toLocaleDateString() : 'Unknown'}
          </div>
        </div>
      </div>

      <h3>Added Blogs</h3>
      {userBlogs.length === 0 ? (
        <p style={{ fontStyle: 'italic', color: '#666' }}>
          No blogs added yet.
        </p>
      ) : (
        <div>
          {userBlogs
            .sort((a, b) => b.likes - a.likes)
            .map(blog => (
              <div key={blog.id} style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                marginBottom: '10px',
                borderRadius: '5px'
              }}>
                <h4 style={{ margin: '0 0 10px 0' }}>{blog.title}</h4>
                <p style={{ margin: '5px 0', color: '#666' }}>
                  by {blog.author}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <a href={blog.url} target="_blank" rel="noopener noreferrer">
                    {blog.url}
                  </a>
                </p>
                <p style={{ margin: '5px 0' }}>
                  <span style={{ 
                    backgroundColor: '#e7f3ff', 
                    padding: '2px 8px', 
                    borderRadius: '12px',
                    fontSize: '14px'
                  }}>
                    ❤️ {blog.likes} likes
                  </span>
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default UserDetail
