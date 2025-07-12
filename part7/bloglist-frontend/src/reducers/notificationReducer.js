import { createSlice } from '@reduxjs/toolkit'

let timeoutId = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification: (state, action) => {
      return action.payload
    },
    clearNotification: () => {
      return null
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

// Thunk for timed notifications
export const setNotificationWithTimeout = (message, timeout = 5000) => {
  return dispatch => {
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    dispatch(setNotification(message))
    
    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
    }, timeout)
  }
}

export default notificationSlice.reducer