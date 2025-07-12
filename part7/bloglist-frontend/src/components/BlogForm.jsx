import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const BlogForm = () => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user.currentUser)

    const handleSubmit = async (event) => {
        event.preventDefault()
        const newBlog = {
            title: title.trim(),
            author: author.trim(),
            url: url.trim()
        }
        
        if (newBlog.title && newBlog.author && newBlog.url) {
            try {
                await dispatch(createBlog(newBlog))
                dispatch(setNotificationWithTimeout(`A new blog "${newBlog.title}" by ${newBlog.author} added`, 5000))
                setTitle('')
                setAuthor('')
                setUrl('')
            } catch (error) {
                dispatch(setNotificationWithTimeout('Error creating blog', 5000))
            }
        } else {
            dispatch(setNotificationWithTimeout('Please fill all fields', 5000))
        }
    }

    // Only show form if user is logged in
    if (!currentUser) {
        return null
    }

    return (
        <div>
            <h2>Create new blog</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    Author:
                    <input
                        type="text"
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    URL:
                    <input
                        type="text"
                        value={url}
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    )
}

export default BlogForm