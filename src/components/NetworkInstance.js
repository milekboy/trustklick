import axios from 'axios'

const NetworkInstance = () => {
  return axios.create({
    baseURL: 'http://46.101.81.175'
  })
}

export default NetworkInstance
