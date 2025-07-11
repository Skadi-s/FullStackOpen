import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// 创建异步 thunk 来处理定时通知
export const setNotificationWithTimeout = createAsyncThunk(
  'notification/setWithTimeout',
  async ({ message, timeout = 5000 }, { dispatch }) => {
    dispatch(setNotification(message))
    
    // 在异步 thunk 中可以使用 setTimeout
    setTimeout(() => {
      dispatch(setNotification(null))
    }, timeout)
    
    return message
  }
)

const useNotificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification: (state, action) => {
      return action.payload
    }
  }
})

export const { setNotification } = useNotificationSlice.actions
export default useNotificationSlice.reducer