import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/loginService'
import blogService from '../services/blogService'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    isLoading: false,
    error: null
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload
      state.error = null
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearUser: (state) => {
      state.currentUser = null
      state.error = null
    }
  }
})

export const { setUser, setLoading, setError, clearUser } = userSlice.actions

// Thunk actions
export const loginUser = (credentials) => {
  return async dispatch => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      
      const user = await loginService.login(credentials)
      
      // 保存到 localStorage
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      
      // 设置认证 token
      blogService.setToken(user.token)
      
      // 设置到 Redux store
      dispatch(setUser(user))
      
      return user
    } catch (error) {
      dispatch(setError(error.response?.data?.error || 'Login failed'))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
}

export const logoutUser = () => {
  return dispatch => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    dispatch(clearUser())
  }
}

export const initializeUser = () => {
  return dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }
}

export default userSlice.reducer
