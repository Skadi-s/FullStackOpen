import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import blogService from '../services/blogService'
import loginService from '../services/loginService'
import { initializeBlogs } from '../reducers/blogReducer'

const useUser = () => {
  const [user, setUser] = useState(null)
  const dispatch = useDispatch()

  // 初始化用户
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // 当用户登录时获取博客
  useEffect(() => {
    if (user) {
      dispatch(initializeBlogs())
    }
  }, [user, dispatch])

  const login = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      setUser(user)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: 'Wrong username or password' }
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    dispatch({ type: 'blogs/setBlogs', payload: [] })
  }

  return { user, login, logout }
}

export default useUser
