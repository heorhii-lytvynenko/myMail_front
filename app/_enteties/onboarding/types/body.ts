import type { CompanySizeType, CompanyType } from '@shared/lib/const'
import type { OnboardingStepType } from './model'

export interface CompleteOnboardingProfileBody {
  avatarId?: number
  headline?: string
  birthDate?: string
}

export interface SetOnboardingAccountTypeBody {
  step: OnboardingStepType
}

export interface CompleteOnboardingCompanyBody {
  displayName: string
  type: CompanyType
  size: CompanySizeType
  emailDomain?: string
  website?: string
}
