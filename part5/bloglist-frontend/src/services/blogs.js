import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const setToken = (newToken) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
}

export default { getAll, setToken }