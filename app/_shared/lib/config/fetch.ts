import { FetchClient } from '../utils/fetch'

export const publicApiClient = new FetchClient({
  baseURL: '/api/public'
})

export const userApiClient = new FetchClient({
  baseURL: '/api/user',
  credentials: 'same-origin'
})
