import type { SelectOptionType } from '@shared/ui/SelectPicker'

export const DATE_PERIODS = [
  { id: 'TODAY', displayName: 'date.today' },
  { id: 'TOMORROW', displayName: 'date.tomorrow' },
  { id: 'THIS_WEEK', displayName: 'date.thisWeek' },
  { id: 'NEXT_WEEK', displayName: 'date.nextWeek' },
  { id: 'THIS_MONTH', displayName: 'date.thisMonth' }
] as const satisfies SelectOptionType[]

export type DatePeriodType = (typeof DATE_PERIODS)[number]['id']
