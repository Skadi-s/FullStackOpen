import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createBlog } from '../reducers/blogReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const CreateBlog = () => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentUser = useSelector(state => state.user.currentUser)

    const handleSubmit = async (event) => {
        event.preventDefault()
        
        const newBlog = {
            title: title.trim(),
            author: author.trim(),
            url: url.trim()
        }
        
        // 验证表单
        if (!newBlog.title || !newBlog.author || !newBlog.url) {
            dispatch(setNotificationWithTimeout('Please fill all fields', 5000))
            return
        }

        // 验证URL格式
        try {
            new URL(newBlog.url.startsWith('http') ? newBlog.url : `https://${newBlog.url}`)
        } catch {
            dispatch(setNotificationWithTimeout('Please enter a valid URL', 5000))
            return
        }
        
        setIsSubmitting(true)
        try {
            const createdBlog = await dispatch(createBlog(newBlog))
            dispatch(setNotificationWithTimeout(`Blog "${newBlog.title}" created successfully!`, 5000))
            
            // 重置表单
            setTitle('')
            setAuthor('')
            setUrl('')
            
            // 导航到新创建的博客详情页或博客列表
            if (createdBlog.id) {
                navigate(`/blogs/${createdBlog.id}`)
            } else {
                navigate('/blogs')
            }
        } catch (error) {
            dispatch(setNotificationWithTimeout('Failed to create blog. Please try again.', 5000))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        navigate('/blogs')
    }

    // 只有登录用户才能访问此页面
    if (!currentUser) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '50px',
                backgroundColor: '#f8d7da',
                borderRadius: '10px',
                margin: '20px 0'
            }}>
                <h2 style={{ color: '#721c24' }}>🚫 Access Denied</h2>
                <p style={{ color: '#721c24', fontSize: '18px' }}>
                    You must be logged in to create a blog post.
                </p>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {/* 页面标题 */}
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ 
                    color: '#2c3e50', 
                    fontSize: '2rem',
                    marginBottom: '10px'
                }}>
                    ✍️ Create New Blog
                </h1>
                <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
                    Share your thoughts and ideas with the community
                </p>
            </div>

            {/* 创建博客表单 */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '30px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e9ecef'
            }}>
                <form onSubmit={handleSubmit}>
                    {/* 标题字段 */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            color: '#2c3e50',
                            fontSize: '14px'
                        }}>
                            📝 Blog Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={({ target }) => setTitle(target.value)}
                            placeholder="Enter an engaging title for your blog..."
                            disabled={isSubmitting}
                            maxLength={100}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '16px',
                                backgroundColor: isSubmitting ? '#f5f5f5' : 'white'
                            }}
                        />
                        <small style={{ color: '#6c757d', fontSize: '12px' }}>
                            {title.length}/100 characters
                        </small>
                    </div>

                    {/* 作者字段 */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            color: '#2c3e50',
                            fontSize: '14px'
                        }}>
                            👤 Author *
                        </label>
                        <input
                            type="text"
                            value={author}
                            onChange={({ target }) => setAuthor(target.value)}
                            placeholder="Who is the author of this blog?"
                            disabled={isSubmitting}
                            maxLength={50}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '16px',
                                backgroundColor: isSubmitting ? '#f5f5f5' : 'white'
                            }}
                        />
                        <small style={{ color: '#6c757d', fontSize: '12px' }}>
                            {author.length}/50 characters
                        </small>
                    </div>

                    {/* URL字段 */}
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            color: '#2c3e50',
                            fontSize: '14px'
                        }}>
                            🔗 Blog URL *
                        </label>
                        <input
                            type="url"
                            value={url}
                            onChange={({ target }) => setUrl(target.value)}
                            placeholder="https://example.com/my-blog-post"
                            disabled={isSubmitting}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '16px',
                                backgroundColor: isSubmitting ? '#f5f5f5' : 'white'
                            }}
                        />
                        <small style={{ color: '#6c757d', fontSize: '12px' }}>
                            Include the full URL where your blog can be read
                        </small>
                    </div>

                    {/* 表单按钮 */}
                    <div style={{
                        display: 'flex',
                        gap: '15px',
                        justifyContent: 'flex-end',
                        marginTop: '30px'
                    }}>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !title.trim() || !author.trim() || !url.trim()}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: isSubmitting || !title.trim() || !author.trim() || !url.trim() 
                                    ? '#6c757d' : '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: isSubmitting || !title.trim() || !author.trim() || !url.trim() 
                                    ? 'not-allowed' : 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                minWidth: '120px'
                            }}
                        >
                            {isSubmitting ? 'Creating...' : '✨ Create Blog'}
                        </button>
                    </div>
                </form>

                {/* 帮助提示 */}
                <div style={{
                    marginTop: '30px',
                    padding: '15px',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '6px',
                    borderLeft: '4px solid #2196f3'
                }}>
                    <h4 style={{ color: '#1976d2', margin: '0 0 10px 0', fontSize: '14px' }}>
                        💡 Tips for creating a great blog post:
                    </h4>
                    <ul style={{ color: '#1565c0', fontSize: '13px', margin: 0, paddingLeft: '20px' }}>
                        <li>Choose a clear, descriptive title that captures attention</li>
                        <li>Make sure the URL is accessible and works properly</li>
                        <li>Double-check all information before submitting</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default CreateBlog
