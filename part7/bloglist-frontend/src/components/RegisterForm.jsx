import { useState } from 'react'
import { useDispatch } from 'react-redux'
import userService from '../services/userService'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'
import { initializeUsers } from '../reducers/usersReducer'

const RegisterForm = ({ onRegisterSuccess, onCancel }) => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const dispatch = useDispatch()

  const handleRegister = async (event) => {
    event.preventDefault()
    
    // 验证表单
    if (!username || !name || !password) {
      dispatch(setNotificationWithTimeout('Please fill all fields', 5000))
      return
    }

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

    try {
      setIsLoading(true)
      const newUser = {
        username: username.trim(),
        name: name.trim(),
        password
      }
      
      await userService.create(newUser)
      dispatch(setNotificationWithTimeout(`User ${name} registered successfully!`, 5000))
      
      // 刷新用户列表
      dispatch(initializeUsers())
      
      // 清空表单
      setUsername('')
      setName('')
      setPassword('')
      setConfirmPassword('')
      
      // 调用成功回调
      if (onRegisterSuccess) {
        onRegisterSuccess()
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed'
      dispatch(setNotificationWithTimeout(errorMessage, 5000))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      width: '100%'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Account</h2>
      
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Full Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            placeholder="Enter your full name"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Username:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            placeholder="Choose a username"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            placeholder="Enter password"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Confirm Password:
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            placeholder="Confirm password"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
      
      <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        <p>• Username and password must be at least 3 characters</p>
        <p>• Please provide your full name for display</p>
      </div>
    </div>
  )
}

export default RegisterForm
