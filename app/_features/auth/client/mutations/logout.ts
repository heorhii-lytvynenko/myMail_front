import { useMutation } from '@tanstack/react-query'
import { removeAccessToken } from '@shared/lib/utils/token'
import { removeRefreshToken } from '@shared/lib/utils/token/actions'
import { authApi } from '@entities/auth'

export const useLogoutMutation = () => {
  const { mutate: logout, ...rest } = useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout()
      } catch {
        await removeRefreshToken()
      } finally {
        await removeAccessToken()
      }
    }
  })

  return {
    logout,
    ...rest
  }
}
