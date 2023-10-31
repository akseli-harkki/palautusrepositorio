import axios from 'axios'
const baseUrl = '/api/blogs'

export const create = async ({ commentObject, id }) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, commentObject)
  return response.data
}
