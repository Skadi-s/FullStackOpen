import { useEffect } from 'react'
import { gql, useSubscription } from '@apollo/client'

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      id
      title
      author {
        name
      }
      published
      genres
    }
  }
`

const BookAddedNotification = () => {
  const { data, loading, error } = useSubscription(BOOK_ADDED)

  useEffect(() => {
    if (data && data.bookAdded) {
      const book = data.bookAdded
      const authorName = book.author && book.author.name ? book.author.name : book.author
      
      // 创建更友好的通知消息
      const message = `📚 新书添加通知！

📖 标题: ${book.title}
✍️ 作者: ${authorName}
📅 出版年份: ${book.published}
🏷️ 类型: ${book.genres.join(', ')}

图书已成功添加到图书馆！`

      window.alert(message)
      
      // 也可以使用浏览器原生通知 API（需要用户授权）
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('新书添加', {
          body: `《${book.title}》 by ${authorName}`,
          icon: '/book-icon.png' // 如果有图标的话
        })
      }
    }
  }, [data])

  // 请求通知权限（可选）
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  if (loading) return <div style={{ fontSize: '12px', color: '#666' }}>正在订阅新书通知...</div>
  if (error) return <div style={{ fontSize: '12px', color: 'red' }}>订阅错误: {error.message}</div>

  return null // 这个组件不需要渲染任何内容
}

export default BookAddedNotification
