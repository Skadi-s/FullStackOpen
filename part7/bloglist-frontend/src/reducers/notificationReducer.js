import createSlice from '@reduxjs/toolkit'

const useNotification = createSlice({
  name: 'notification',
  initialState: null,
    reducers: {
        setNotification(state, action) {
        return action.payload
        }
    }
})

export const { setNotification } = useNotification.actions
export default useNotification.reducer