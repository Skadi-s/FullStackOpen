import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogService'

// 使用 Redux Toolkit 的 createSlice
const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    // 设置所有博客
    setBlogs: (state, action) => {
      return action.payload
    },
    
    // 添加新博客
    addBlog: (state, action) => {
      state.push(action.payload)
    },
    
    // 更新博客（用于点赞等操作）
    updateBlog: (state, action) => {
      const updatedBlog = action.payload
      const index = state.blogs.findIndex(blog => blog.id === updatedBlog.id)
      if (index !== -1) {
        state.blogs[index] = updatedBlog
      }
    },
    
    // 删除博客
    removeBlog: (state, action) => {
      const id = action.payload
      state.blogs = state.blogs.filter(blog => blog.id !== id)
    },
  }
})

// 导出 action creators
export const { 
  setBlogs, 
  addBlog, 
  updateBlog, 
  removeBlog 
} = blogSlice.actions

// Thunk actions（异步操作）
export const initializeBlogs = () => {
  return async dispatch => {
    try {
      const blogs = await blogService.getAll()
      dispatch(setBlogs(blogs))
    } catch {
      // dispatch(setError('Failed to fetch blogs'))
    } finally {
      // dispatch(setLoading(false))
    }
  }
}

export const createBlog = (blogData) => {
  return async dispatch => {
      // dispatch(setLoading(true))
      const newBlog = await blogService.create(blogData)
      dispatch(addBlog(newBlog))
      return newBlog
    }

}

export const likeBlog = (id) => {
  return async (dispatch, getState) => {
    const { blogs } = getState().blogs
    const blogToUpdate = blogs.find(blog => blog.id === id)

    const updatedBlogData = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
    user: blogToUpdate.user.id // 确保只发送用户ID
    }

    const updatedBlog = await blogService.update(id, updatedBlogData)
    dispatch(updateBlog(updatedBlog))
    return updatedBlog
  }
}

export const deleteBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch(removeBlog(id))
  }
}

// 导出 reducer
export default blogSlice.reducer
