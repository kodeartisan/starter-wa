import fetchAdapter from '@haverstack/axios-fetch-adapter'
import axios from 'axios'

const http = axios.create({
  adapter: fetchAdapter,
})

export default http
