import { authApi } from '@entities/auth'
import { FetchClient, isClient } from '../utils'
import { getAccessToken, setAccessToken } from '../utils/token'
import { removeTokens } from '../utils/token/actions'

export const publicApiClient = new FetchClient({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public`
})

export const authApiClient = new FetchClient({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth`
})

export const userApiClient = new FetchClient({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`,
  credentials: 'include'
})

userApiClient.onBeforeRequest(async (_, options) => {
  const token = await getAccessToken()

  if (!token) {
    return
  }

  options.headers = {
    Authorization: `Bearer ${token}`,
    ...options.headers
  }
})

userApiClient.onResponseError(async (error) => {
  if (!isClient()) {
    return
  }

  if (error.status !== 401) {
    return
  }

  if (error._isRetry) {
    await removeTokens()

    return
  }

  try {
    const { data } = await authApi.refresh()

    await setAccessToken(data.accessToken)

    error._isRetry = true

    return true
  } catch {
    await removeTokens()

    return false
  }
})
