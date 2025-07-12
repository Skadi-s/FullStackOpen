import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/userReducer'
import userService from '../services/userService'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const AuthForm = () => {
  const [isRegistering, setIsRegistering] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await dispatch(loginUser({ username, password }))
      setUsername('')
      setPassword('')
      dispatch(setNotificationWithTimeout(`Welcome ${username}!`, 5000))
    } catch (error) {
      dispatch(setNotificationWithTimeout('Login failed', 5000))
    }
    setIsSubmitting(false)
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    
    if (password !== confirmPassword) {
      dispatch(setNotificationWithTimeout('Passwords do not match', 5000))
      return
    }

    if (password.length < 3) {
      dispatch(setNotificationWithTimeout('Password must be at least 3 characters long', 5000))
      return
    }

    if (username.length < 3) {
      dispatch(setNotificationWithTimeout('Username must be at least 3 characters long', 5000))
      return
    }

    if (name.trim().length < 2) {
      dispatch(setNotificationWithTimeout('Name must be at least 2 characters long', 5000))
      return
    }

    try {
      setIsSubmitting(true)
      await userService.create({
        username,
        password,
        name: name.trim()
      })
      
      dispatch(setNotificationWithTimeout('Registration successful! You can now login.', 5000))
      setIsRegistering(false)
      setUsername('')
      setPassword('')
      setName('')
      setConfirmPassword('')
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed'
      dispatch(setNotificationWithTimeout(errorMessage, 5000))
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleMode = () => {
    setIsRegistering(!isRegistering)
    setUsername('')
    setPassword('')
    setName('')
    setConfirmPassword('')
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        📝 Blog App {isRegistering ? 'Register' : 'Login'}
      </h2>
      
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        {isRegistering && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>
              Full Name: *
            </label>
            <input
              type="text"
              value={name}
              name="Name"
              placeholder="Enter your full name"
              onChange={({ target }) => setName(target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
        )}
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>
            Username: *
          </label>
          <input
            type="text"
            value={username}
            name="Username"
            placeholder="Enter your username"
            onChange={({ target }) => setUsername(target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: isRegistering ? '20px' : '25px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>
            Password: *
          </label>
          <input
            type="password"
            value={password}
            name="Password"
            placeholder="Enter your password"
            onChange={({ target }) => setPassword(target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>
        
        {isRegistering && (
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>
              Confirm Password: *
            </label>
            <input
              type="password"
              value={confirmPassword}
              name="ConfirmPassword"
              placeholder="Confirm your password"
              onChange={({ target }) => setConfirmPassword(target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isSubmitting ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            marginBottom: '15px'
          }}
          onMouseOver={(e) => {
            if (!isSubmitting) e.target.style.backgroundColor = '#0056b3'
          }}
          onMouseOut={(e) => {
            if (!isSubmitting) e.target.style.backgroundColor = '#007bff'
          }}
        >
          {isSubmitting ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', paddingTop: '15px', borderTop: '1px solid #eee' }}>
        <span style={{ color: '#666' }}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
        </span>
        <button
          onClick={toggleMode}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
            textDecoration: 'underline',
            marginLeft: '5px',
            fontSize: '14px'
          }}
        >
          {isRegistering ? 'Login here' : 'Register here'}
        </button>
      </div>
    </div>
  )
}

export default AuthForm