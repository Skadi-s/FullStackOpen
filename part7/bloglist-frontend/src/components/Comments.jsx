import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { initializeComments, createComment } from '../reducers/commentReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const Comments = ({ blogId }) => {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const comments = useSelector(state => state.comments[blogId] || [])

  useEffect(() => {
    if (blogId) {
      dispatch(initializeComments(blogId))
    }
  }, [dispatch, blogId])

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!newComment.trim()) {
      dispatch(setNotificationWithTimeout('Comment cannot be empty', 3000))
      return
    }

    setIsSubmitting(true)
    try {
      await dispatch(createComment(blogId, newComment.trim()))
      setNewComment('')
      dispatch(setNotificationWithTimeout('Comment added successfully!', 3000))
    } catch (error) {
      dispatch(setNotificationWithTimeout('Failed to add comment', 5000))
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div style={{
      marginTop: '30px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef'
    }}>
      <h3 style={{ 
        color: '#2c3e50', 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        💬 Comments ({comments.length})
      </h3>

      {/* 添加评论表单 */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            maxLength={500}
            disabled={isSubmitting}
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              backgroundColor: isSubmitting ? '#f5f5f5' : 'white'
            }}
          />
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <span style={{ 
            fontSize: '12px', 
            color: '#666',
            opacity: newComment.length > 450 ? 1 : 0.7
          }}>
            {newComment.length}/500 characters
          </span>
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            style={{
              padding: '8px 20px',
              backgroundColor: isSubmitting || !newComment.trim() ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isSubmitting || !newComment.trim() ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {isSubmitting ? 'Adding...' : 'Add Comment'}
          </button>
        </div>
      </form>

      {/* 评论列表 */}
      {comments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '30px',
          color: '#6c757d',
          backgroundColor: 'white',
          borderRadius: '6px',
          border: '1px dashed #dee2e6'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>💭</div>
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px' 
        }}>
          {comments.map((comment, index) => (
            <div
              key={comment._id || index}
              style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #e9ecef',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <p style={{
                margin: '0 0 10px 0',
                color: '#2c3e50',
                lineHeight: '1.5',
                fontSize: '14px'
              }}>
                {comment.content}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                color: '#6c757d'
              }}>
                <span>Anonymous</span>
                <span>{formatDate(comment.date)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Comments
