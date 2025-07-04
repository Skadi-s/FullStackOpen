
const BlogFormTitle = ({ user, handleLogout }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default BlogFormTitle