import { getAccoutServer } from '@entities/server'
import { getOnboardingStateServer } from '@entities/onboarding/server'

export const getInitialAppData = async () => {
  const [account, onboardingState] = await Promise.all([
    getAccoutServer(),
    getOnboardingStateServer()
  ])

  return {
    account,
    onboardingState
  }
}
