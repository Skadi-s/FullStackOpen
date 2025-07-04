import { useState } from "react"

const Blog = ({ blog, likeBlog }) => {
  const style = {
    padding: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [viewbutton, setViewButton] = useState('view')
  const [likes, setLikes] = useState(blog.likes)

  const handleClickLike = async(id) => {
    try {
      const updatedBlog = await likeBlog(id)
      setLikes(updatedBlog.likes) // 使用后端返回的实际 likes 数
    } catch (error) {
      console.error('Error liking blog:', error)
    }
  }

  return (
    <div style={style}>
      <h2>{blog.title} by {blog.author}</h2>
      <button onClick={() => {
        if (viewbutton === 'view') {
          setViewButton('hide')
        } else {
          setViewButton('view')
        }
      }}>{viewbutton}</button>
      <div style={{ display: viewbutton === 'view' ? 'none' : '' }}>
        <p>{blog.url}</p>
        <p>likes {likes} <button onClick={() => handleClickLike(blog.id)}>like</button></p>
        <p>{blog.user.name}</p>
      </div>
    </div>
  )
}

export default Blog