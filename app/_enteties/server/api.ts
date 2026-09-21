import { getAccessToken } from '@shared/lib/utils/token'
import { accountApi } from '@entities/account'

export const getAccoutServer = async () => {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return null
  }

  try {
    const { data } = await accountApi.getAccount()

    return data
  } catch {
    return null
  }
}
