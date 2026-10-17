import { userApiClient } from '@shared/lib/config'
import type { FetchOptions, FetchParams } from '@shared/lib/utils'
import type {
  CompleteOnboardingCompanyBody,
  CompleteOnboardingProfileBody,
  GetOnboardingStateResponse,
  SetOnboardingAccountTypeBody
} from './types'

export const onboardingApi = {
  getState: async (options?: FetchOptions<FetchParams>) => {
    return userApiClient.get<GetOnboardingStateResponse>(
      '/onboarding/state',
      options
    )
  },

  completeWelcome: async () => {
    return userApiClient.post<void>('/onboarding/welcome')
  },

  completeProfile: async (body: CompleteOnboardingProfileBody) => {
    return userApiClient.post<void, CompleteOnboardingProfileBody>(
      '/onboarding/profile',
      body
    )
  },

  setAccountType: async (body: SetOnboardingAccountTypeBody) => {
    return userApiClient.post<void, SetOnboardingAccountTypeBody>(
      '/onboarding/account-type',
      body
    )
  },

  completeCompany: async (body: CompleteOnboardingCompanyBody) => {
    return userApiClient.post<void, CompleteOnboardingCompanyBody>(
      '/onboarding/company',
      body
    )
  }
}
