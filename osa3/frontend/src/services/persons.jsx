import axios from 'axios'
const baseUrl = '/api/persons'

const getData = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => axios.post(baseUrl, newObject)

const remove = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    return  axios.put(`${baseUrl}/${id}`, newObject)
    }

export default {getData, create, remove, update}