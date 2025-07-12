import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUser())
    dispatch(initializeBlogs())
  }, [dispatch])

  return (
    <div>
      <Notification />
      <LoginForm />
      <BlogForm />
      <BlogList />
    </div>
  )
}

export default App
