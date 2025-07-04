import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const setToken = (newToken) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
}

const create = async (blogObject) => {
  const config = {
    headers: { Authorization: axios.defaults.headers.common['Authorization'] }
  }
  const response = await axios.post(baseUrl, blogObject, config)
  return response.data
}

const update = async (id, blogObject) => {
  const config = {
    headers: { Authorization: axios.defaults.headers.common['Authorization'] }
  }
  const response = await axios.put(`${baseUrl}/${id}`, blogObject, config)
  return response.data
}

export default { getAll, setToken, create, update }