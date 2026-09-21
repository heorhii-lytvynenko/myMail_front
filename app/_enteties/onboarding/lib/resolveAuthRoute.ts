import { ROUTES } from '@shared/lib/const'
import type { OnboardingStateType } from '../types'
import { resolveOnboardingRoute } from './resolveOnboardingRoute'

interface Options {
  href: string
  hasAccount: boolean
  onboardingState: OnboardingStateType | null
}

export const resolveAuthRoute = ({
  href,
  hasAccount,
  onboardingState
}: Options) => {
  if (!hasAccount) {
    return ROUTES.login
  }

  const onboardingRoute = resolveOnboardingRoute(onboardingState)

  if (onboardingRoute) {
    return onboardingRoute
  }

  return href
}
