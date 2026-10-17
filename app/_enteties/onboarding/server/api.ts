import { getAccessToken } from '@shared/lib/utils/token'
import { onboardingApi } from '../api'

export const getOnboardingStateServer = async () => {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return null
  }

  try {
    const { data } = await onboardingApi.getState()

    return data
  } catch {
    return null
  }
}
