import { useEffect, useRef } from 'react'
import useBookAddedSubscription from '../hooks/useBookAddedSubscription'

const BookAddedNotification = () => {
  const processedBooksRef = useRef(new Set())
  
  const { data, loading, error } = useBookAddedSubscription()

  // 监听订阅数据并显示通知
  useEffect(() => {
    if (data?.bookAdded) {
      const book = data.bookAdded
      
      // 检查这本书是否已经处理过
      if (processedBooksRef.current.has(book.id)) {
        return
      }
      
      // 标记这本书已经处理过
      processedBooksRef.current.add(book.id)
      
      const authorName = book.author && book.author.name ? book.author.name : 'Unknown Author'
      const message = `📚 新书《${book.title}》by ${authorName} 已添加到图书馆！`
      
      // 显示通知
      console.log('Showing notification for new book:', book.title)
      alert(message)
      
      // 浏览器原生通知
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('新书添加', {
            body: message,
            icon: '/book-icon.png'
          })
        } else if (Notification.permission === 'default') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification('新书添加', {
                body: message,
                icon: '/book-icon.png'
              })
            }
          })
        }
      }
    }
  }, [data])

  return (
    <div style={{ fontSize: '12px', color: loading ? '#666' : error ? 'red' : 'green' }}>
      {loading && '🔄 正在订阅新书通知...'}
      {error && `❌ 订阅错误: ${error.message}`}
      {!loading && !error && '✅ 已连接到实时通知'}
    </div>
  )
}

export default BookAddedNotification
