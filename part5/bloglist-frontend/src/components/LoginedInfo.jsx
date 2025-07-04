const LoginedInfo = ({ user, handleLogout }) => {
  return (
    <div>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default LoginedInfo;
