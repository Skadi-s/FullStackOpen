import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { likeBlog, deleteBlog } from '../reducers/blogReducer';
import { setNotificationWithTimeout } from '../reducers/notificationReducer';

const Blog = ({ blog }) => {
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user.currentUser)

    const handleLike = async () => {
        try {
            await dispatch(likeBlog(blog.id))
        } catch (error) {
            dispatch(setNotificationWithTimeout('Error liking blog', 5000))
        }
    }

    const handleDelete = async () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
            try {
                await dispatch(deleteBlog(blog.id))
                dispatch(setNotificationWithTimeout(`Blog "${blog.title}" removed`, 5000))
            } catch (error) {
                dispatch(setNotificationWithTimeout('Error removing blog', 5000))
            }
        }
    }

    // Check if current user can delete this blog
    const canDelete = currentUser && blog.user && (
        blog.user.username === currentUser.username || 
        blog.user.id === currentUser.id
    )

    return (
        <div className="blog" style={{ 
            border: '1px solid #ccc', 
            padding: '10px', 
            margin: '10px 0' 
        }}>
            <h3>{blog.title} by {blog.author}</h3>
            <p>{blog.url}</p>
            <p>
                Likes: {blog.likes} 
                <button onClick={handleLike} style={{ marginLeft: '10px' }}>
                    Like
                </button>
                <Link 
                    to={`/blogs/${blog.id}`} 
                    style={{ 
                        marginLeft: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        display: 'inline-block'
                    }}
                >
                    View Details
                </Link>
            </p>
            {blog.user && <p>Added by: {blog.user.name}</p>}
            {canDelete && (
                <button 
                    onClick={handleDelete} 
                    style={{ 
                        backgroundColor: '#ff4444', 
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        cursor: 'pointer'
                    }}
                >
                    Remove
                </button>
            )}
        </div>
    )
}

export default Blog;