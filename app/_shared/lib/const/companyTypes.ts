import z from 'zod'
import type { SelectOptionType } from '@shared/ui/SelectPicker'

export const COMPANY_TYPES = {
  COMPANY: 'company',
  AGENCY: 'agency',
  INDIVIDUAL_RECRUITER: 'individualRecruiter'
} as const

export type CompanyType = keyof typeof COMPANY_TYPES

export const CompanyTypeSchema = z.enum(
  Object.keys(COMPANY_TYPES) as CompanyType[],
  { error: 'validation.companyTypeInvalid' }
)

export const COMPANY_SIZES = [
  {
    id: 'SIZE_1',
    displayName: 'company.size.1'
  },
  {
    id: 'SIZE_1_10',
    displayName: 'company.size.1_10'
  },
  {
    id: 'SIZE_11_50',
    displayName: 'company.size.11_50'
  },
  {
    id: 'SIZE_51_200',
    displayName: 'company.size.51_200'
  },
  {
    id: 'SIZE_201_500',
    displayName: 'company.size.201_500'
  },
  {
    id: 'SIZE_500_PLUS',
    displayName: 'company.size.500_plus'
  }
] as const satisfies SelectOptionType[]

export const COMPANY_SIZE_IDS = COMPANY_SIZES.map((v) => v.id)

export type CompanySizeType = (typeof COMPANY_SIZE_IDS)[number]

export const CompanySizeSchema = z.enum(COMPANY_SIZE_IDS as CompanySizeType[], {
  error: 'validation.companySizeInvalid'
})
