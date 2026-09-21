import type { SelectOptionType } from '@shared/ui/SelectPicker'

export const SALARY_TYPES = [
  { id: 'NETTO', displayName: 'salaryTypes.netto' },
  { id: 'GROSS', displayName: 'salaryTypes.gross' }
] as const satisfies SelectOptionType[]

export const SALARY_TYPE_IDS = SALARY_TYPES.map((v) => v.id)
