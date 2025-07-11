import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/login'

const signupUrl = 'http://localhost:3000/api/users'

const signup = async (userData) => {
  const response = await axios.post(signupUrl, userData)
  return response.data
}

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login, signup }