import axios from 'axios'

const NetworkInstance = () => {
  return axios.create({
    baseURL: '/api' // frontend proxy handles redirect to the backend
  })
}

export default NetworkInstance
