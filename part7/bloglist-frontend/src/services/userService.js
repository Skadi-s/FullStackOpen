import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/users'

// 获取当前用户信息的辅助函数
const getCurrentUser = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  if (loggedUserJSON) {
    return JSON.parse(loggedUserJSON)
  }
  return null
}

const getAll = async () => {
  // 如果没有认证token，返回空数组而不发送请求
  if (!axios.defaults.headers.common['Authorization']) {
    return Promise.resolve([])
  }
  
  // 检查当前用户是否为root用户
  const currentUser = getCurrentUser()
  if (!currentUser || currentUser.username !== 'root') {
    return Promise.resolve([])
  }
  
  const response = await axios.get(baseUrl)
  return response.data
}

const getById = async (id) => {
  // 检查当前用户是否为root用户
  const currentUser = getCurrentUser()
  if (!currentUser || currentUser.username !== 'root') {
    throw new Error('Unauthorized: Only root users can access user details')
  }
  
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const create = async (newUser) => {
  // 注册功能允许所有人使用，不需要root权限
  const response = await axios.post(baseUrl, newUser)
  return response.data
}

const remove = async (id) => {
  // 检查当前用户是否为root用户
  const currentUser = getCurrentUser()
  if (!currentUser || currentUser.username !== 'root') {
    throw new Error('Unauthorized: Only root users can delete users')
  }
  
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

export default { getAll, getById, create, remove }
