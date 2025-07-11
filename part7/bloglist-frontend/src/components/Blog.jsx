import React from 'react';
import { useDispatch } from 'react-redux';
import { likeBlog, deleteBlog } from '../reducers/blogReducer';

const Blog = ({ blog }) => {
    const dispatch = useDispatch()

    const handleLike = () => {
        dispatch(likeBlog(blog.id))
    }

    const handleDelete = () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
            dispatch(deleteBlog(blog.id))
        }
    }

    return (
        <div className="blog">
        <h2>{blog.title}</h2>
        <p>{blog.author}</p>
        <p>{blog.url}</p>
        <p>Likes: {blog.likes}</p>
        <button onClick={handleLike}>Like</button>
        <button onClick={handleDelete}>Remove</button>
        </div>
    )
}

export default Blog;