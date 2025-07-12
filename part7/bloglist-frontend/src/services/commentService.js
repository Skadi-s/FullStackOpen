import axios from 'axios'

const baseUrl = 'http://localhost:3000/api/blogs'

const getComments = async (blogId) => {
  const response = await axios.get(`${baseUrl}/${blogId}/comments`)
  return response.data
}

const addComment = async (blogId, content) => {
  const response = await axios.post(`${baseUrl}/${blogId}/comments`, { content })
  return response.data
}

export default { getComments, addComment }
