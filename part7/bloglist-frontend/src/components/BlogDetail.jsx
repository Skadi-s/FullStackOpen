import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'
import { canDeleteOwnBlogs } from '../utils/permissions'
import Comments from './Comments'

const BlogDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const currentUser = useSelector(state => state.user.currentUser)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '50px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        margin: '20px 0'
      }}>
        <h2 style={{ color: '#6c757d' }}>📝 Blog Not Found</h2>
        <p style={{ color: '#6c757d', marginBottom: '20px' }}>
          The blog you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/blogs')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ← Back to Blogs
        </button>
      </div>
    )
  }

  const handleLike = async () => {
    try {
      await dispatch(likeBlog(blog.id))
      dispatch(setNotificationWithTimeout(`You liked "${blog.title}"`, 3000))
    } catch (error) {
      dispatch(setNotificationWithTimeout('Failed to like the blog', 5000))
    }
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteBlog(blog.id))
      dispatch(setNotificationWithTimeout(`Blog "${blog.title}" deleted successfully`, 5000))
      navigate('/blogs')
    } catch (error) {
      dispatch(setNotificationWithTimeout('Failed to delete the blog', 5000))
    }
    setShowDeleteConfirm(false)
  }

  const canDelete = canDeleteOwnBlogs(currentUser, blog)

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* 返回按钮 */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/blogs')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          ← Back to Blogs
        </button>
      </div>

      {/* 博客详情卡片 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e9ecef'
      }}>
        {/* 标题 */}
        <h1 style={{
          color: '#2c3e50',
          marginBottom: '10px',
          fontSize: '2rem',
          lineHeight: '1.2'
        }}>
          {blog.title}
        </h1>

        {/* 作者信息 */}
        <div style={{
          color: '#6c757d',
          fontSize: '1.1rem',
          marginBottom: '20px',
          fontStyle: 'italic'
        }}>
          by <strong>{blog.author}</strong>
        </div>

        {/* URL链接 */}
        <div style={{
          marginBottom: '25px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px',
          borderLeft: '4px solid #007bff'
        }}>
          <strong>🔗 Blog URL:</strong>
          <br />
          <a
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#007bff',
              textDecoration: 'none',
              wordBreak: 'break-all'
            }}
            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
          >
            {blog.url}
          </a>
        </div>

        {/* 点赞和删除操作 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button
              onClick={handleLike}
              style={{
                padding: '10px 20px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '16px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
            >
              ❤️ Like ({blog.likes})
            </button>
          </div>

          {canDelete && (
            <div>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Delete
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: '#dc3545', fontWeight: 'bold' }}>
                    Are you sure?
                  </span>
                  <button
                    onClick={handleDelete}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 博客信息 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div style={{
            padding: '15px',
            backgroundColor: '#e3f2fd',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              {blog.likes}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Likes</div>
          </div>
          
          {blog.user && (
            <div style={{
              padding: '15px',
              backgroundColor: '#f3e5f5',
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#7b1fa2' }}>
                {blog.user.name || blog.user.username}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Added by</div>
            </div>
          )}
        </div>

        {/* 博客描述或内容区域 */}
        <div style={{
          padding: '20px',
          backgroundColor: '#fafafa',
          borderRadius: '5px',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>📖 About this blog</h3>
          <p style={{ color: '#555', lineHeight: '1.6', fontSize: '16px' }}>
            This is a blog post titled "<strong>{blog.title}</strong>" written by <strong>{blog.author}</strong>. 
            It has received <strong>{blog.likes}</strong> like{blog.likes !== 1 ? 's' : ''} from the community.
          </p>
          {blog.user && (
            <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
              Added by {blog.user.name || blog.user.username} 
              {blog.user.username && blog.user.name && ` (@${blog.user.username})`}
            </p>
          )}
        </div>
      </div>

      {/* 评论部分 */}
      <Comments blogId={blog.id} />
    </div>
  )
}

export default BlogDetail
