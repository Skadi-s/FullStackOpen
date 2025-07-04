import { useState } from "react"

const Blog = ({ blog, likeBlog , removeBlog }) => {
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

  const handleClickRemove = (id) => {
    removeBlog(id)
    console.log('remove blog', id)
  }

  return (
    <div style={style}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h2 style={{ margin: 0 }}>{blog.title} by {blog.author}</h2>
        <button onClick={() => {
          setViewButton(viewbutton === 'view' ? 'hide' : 'view')
        }}>{viewbutton}</button>
      </div>
      <div style={{ display: viewbutton === 'view' ? 'none' : '' }}>
        <p>{blog.url}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <p>likes {likes}</p>
          <button onClick={() => handleClickLike(blog.id)}>like</button>
        </div>
        <p>{blog.user.name}</p>
        <button onClick={() => handleClickRemove(blog.id)}>remove</button>
      </div>
    </div>
  )
}

export default Blog