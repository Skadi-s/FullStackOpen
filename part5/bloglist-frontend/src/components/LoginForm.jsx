const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin({ username, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm