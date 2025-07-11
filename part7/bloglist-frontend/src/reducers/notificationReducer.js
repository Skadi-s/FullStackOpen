import { createSlice } from '@reduxjs/toolkit'

const useNotificationSlice = createSlice({
  name: 'notification',
  initialState: null,
    reducers: {
        setNotification(state, action) {
        return action.payload
        }
    }
})

export const { setNotification } = useNotificationSlice.actions
export default useNotificationSlice.reducer