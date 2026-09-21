import { authApiClient } from '@shared/lib/config'
import type { OAuthProvider } from '@shared/lib/const'
import type { FetchOptions } from '@shared/lib/utils'
import type {
  LoginBody,
  LoginResponse,
  RegisterBody,
  RegisterResponse,
  ResetPasswordBody,
  NewPasswordBody,
  NewPasswordResponse,
  ResetPasswordResponse
} from './types'

export const authApi = {
  register: (body: RegisterBody) => {
    return authApiClient.post<RegisterResponse>('/register', body)
  },

  verifyEmail: async (token: string) => {
    return authApiClient.post('/email/verify', { token })
  },

  resendEmailVerification: async (email: string) => {
    return authApiClient.post('/email/verify/resend', { email })
  },

  login: async (body: LoginBody) => {
    const response = await authApiClient.post<LoginResponse>('/login', body, {
      credentials: 'include'
    })

    return response
  },

  logout: async () => {
    return authApiClient.post('/logout', undefined, {
      credentials: 'include'
    })
  },

  refresh: async (options?: FetchOptions) => {
    return authApiClient.post('/refresh', undefined, {
      credentials: 'include',
      ...options
    })
  },

  resetPassword: async (body: ResetPasswordBody) => {
    return authApiClient.post<ResetPasswordResponse>(
      '/password-recovery/reset',
      body
    )
  },

  newPassword: async (body: NewPasswordBody) => {
    return authApiClient.post<NewPasswordResponse>(
      '/password-recovery/new-password',
      body
    )
  },

  oauthConnect: async (provider: OAuthProvider) => {
    return authApiClient.get(`/oauth/connect/${provider}`)
  }
}
