import { useMutation } from '@tanstack/react-query'
import type { OAuthProvider } from '@shared/lib/const'
import { errorHandler } from '@shared/lib/utils/error'
import { authApi } from '@entities/auth'

export const useOAuthConnectMutation = () => {
  const { mutate: oauthConnect, ...rest } = useMutation({
    mutationFn: async (provider: OAuthProvider) => {
      await authApi.oauthConnect(provider)
    },
    onError: errorHandler
  })

  return {
    oauthConnect,
    ...rest
  }
}
