import 'server-only'
import { backendUrl, getSessionToken } from 'app/_features/auth/session'
import { onboardingApi } from '../api'

export const getOnboardingStateServer = async () => {
  const accessToken = await getSessionToken()

  if (!accessToken) {
    return null
  }

  try {
    const { data } = await onboardingApi.getState({ baseURL: backendUrl('/api/user'), headers: { Authorization: `Bearer ${accessToken}` } })

    return data
  } catch {
    return null
  }
}
