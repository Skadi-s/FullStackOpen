import { createSlice } from '@reduxjs/toolkit'
import commentService from '../services/commentService'

const commentSlice = createSlice({
  name: 'comments',
  initialState: {},
  reducers: {
    setComments(state, action) {
      const { blogId, comments } = action.payload
      state[blogId] = comments
    },
    addComment(state, action) {
      const { blogId, comment } = action.payload
      if (!state[blogId]) {
        state[blogId] = []
      }
      state[blogId].push(comment)
    }
  }
})

export const { setComments, addComment } = commentSlice.actions

// Async actions
export const initializeComments = (blogId) => {
  return async dispatch => {
    try {
      const comments = await commentService.getComments(blogId)
      dispatch(setComments({ blogId, comments }))
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    }
  }
}

export const createComment = (blogId, content) => {
  return async dispatch => {
    try {
      const comment = await commentService.addComment(blogId, content)
      dispatch(addComment({ blogId, comment }))
      return comment
    } catch (error) {
      console.error('Failed to add comment:', error)
      throw error
    }
  }
}

export default commentSlice.reducer
