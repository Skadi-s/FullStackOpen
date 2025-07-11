import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogService'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        addBlog: (state, action) => {
        state.push(action.payload)
        },
        setBlogs: (state, action) => {
        return action.payload
        },
        updateBlog: (state, action) => {
        const updatedBlog = action.payload
        return state.map(blog =>
            blog.id !== updatedBlog.id ? blog : updatedBlog
        )
        }
    }
})
export const { addBlog, setBlogs, updateBlog } = blogSlice.actions
export default blogSlice.reducer

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}

export const createBlog = (blog) => {
    return async dispatch => {
        const newBlog = await blogService.create(blog)
        dispatch(addBlog(newBlog))
    }
}

export const likeBlog = (id) => {
    return async (dispatch, getState) => {
        const { blogs } = getState()
        const blogToLike = blogs.find(b => b.id === id)
        const updatedBlog = {
            ...blogToLike,
            likes: blogToLike.likes + 1
        }
        
        const returnedBlog = await blogService.update(id, updatedBlog)
        dispatch(updateBlog(returnedBlog))
    }
}

export const deleteBlog = (id) => {
    return async dispatch => {
        await blogService.remove(id)
        dispatch(updateBlog({ id, deleted: true }))
    }
}
