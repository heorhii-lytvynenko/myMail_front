export type OnboardingStepType =
  | 'WELCOME'
  | 'PROFILE'
  | 'ACCOUNT_TYPE'
  | 'CREATE_COMPANY'
  | 'CREATE_COMPANY_AGENCY'
  | 'CREATE_COMPANY_INDIVIDUAL_RECRUITER'
  | 'DONE'

export interface OnboardingStateType {
  step: OnboardingStepType
  isComplete: boolean
  completedAt?: string | null
}
