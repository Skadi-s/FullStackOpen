import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/userService'

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    isLoading: false,
    error: null
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload
      state.error = null
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { setUsers, setLoading, setError } = usersSlice.actions

// Thunk actions
export const initializeUsers = () => {
  return async dispatch => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const users = await userService.getAll()
      dispatch(setUsers(users))
    } catch (error) {
      // 如果是认证错误，静默处理，不显示错误信息
      const errorMessage = error.response?.status === 401 ? null : 'Failed to fetch users'
      if (errorMessage) {
        dispatch(setError(errorMessage))
      }
    } finally {
      dispatch(setLoading(false))
    }
  }
}

export default usersSlice.reducer
