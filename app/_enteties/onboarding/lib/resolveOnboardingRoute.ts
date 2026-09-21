import { ROUTES } from '@shared/lib/const'
import type { OnboardingStateType, OnboardingStepType } from '../types'

const ONBOARDING_STEP_ROUTES: Record<OnboardingStepType, string> = {
  WELCOME: ROUTES.onboardingWelcome,
  PROFILE: ROUTES.onboardingProfile,
  ACCOUNT_TYPE: ROUTES.onboardingAccountType,
  CREATE_COMPANY: ROUTES.onboardingCompany,
  CREATE_COMPANY_AGENCY: ROUTES.onboardingCompany,
  CREATE_COMPANY_INDIVIDUAL_RECRUITER: ROUTES.onboardingCompany,
  DONE: ROUTES.onboardingDone
}

export const resolveOnboardingRoute = (
  onboardingState: OnboardingStateType | null
) => {
  if (!onboardingState) {
    return null
  }

  const { step, isComplete } = onboardingState

  if (step === 'DONE' && isComplete) {
    return null
  }

  return ONBOARDING_STEP_ROUTES[step] ?? null
}
