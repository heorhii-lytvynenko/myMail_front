import 'server-only'
import { backendUrl, getSessionToken } from 'app/_features/auth/session'
import { accountApi } from '@entities/account'

export const getAccoutServer = async () => {
  const accessToken = await getSessionToken()

  if (!accessToken) {
    return null
  }

  try {
    const { data } = await accountApi.getAccount({ baseURL: backendUrl('/api/user'), headers: { Authorization: `Bearer ${accessToken}` } })

    return data
  } catch {
    return null
  }
}
