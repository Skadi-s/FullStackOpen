import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import BlogFormTitle from './components/BlogFormTitle'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Message from './components/Message'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      setUser(user)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
    } catch (exception) {
      setMessage('Wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      console.error('Login failed:', exception) 
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setBlogs([])
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      blogService.getAll().then(blogs => {
        setBlogs(blogs)
      })
    }
  }, [])
  
  if (user !== null) {
    return (
      <div>
        <h2>blogs</h2>
        <div>
          <Message message={message} />
          <BlogFormTitle user={user} handleLogout={handleLogout} />
          <BlogForm setBlogs={setBlogs} blogs={blogs} />
        </div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }
  return (
    <div>
      <h2>Login to application</h2>
      <Message message={message} />
      <LoginForm handleLogin={handleLogin}/>
    </div>
  )

}

export default App
