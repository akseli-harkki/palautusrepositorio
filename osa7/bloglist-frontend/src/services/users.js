import axios from 'axios'
const baseUrl = '/api/users'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAllUsers = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

export const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const put = async ({ newObject, id }) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAllUsers, setToken, put, remove }
