import { useState, useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import LoginedInfo from './components/LoginedInfo'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Message from './components/Message'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const LoginFormRef = useRef()
  const blogFormRef = useRef()

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

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage('Failed to create blog')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      console.error('Blog creation failed:', exception)
    }
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
          <LoginedInfo user={user} handleLogout={handleLogout} />
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>
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
      <Togglable buttonLabel="login" ref={LoginFormRef}>
        <LoginForm handleLogin={handleLogin} />
      </Togglable>
    </div>
  )

}

export default App
