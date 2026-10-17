import type { SelectOptionType } from '@shared/ui/SelectPicker'

export const PERIODS = [
  { id: 'HOURLY', displayName: 'periods.hourly' },
  { id: 'MONTHLY', displayName: 'periods.monthly' },
  { id: 'ANNUAL', displayName: 'periods.annual' }
] as const satisfies SelectOptionType[]

export const PERIOD_IDS = PERIODS.map((v) => v.id)
