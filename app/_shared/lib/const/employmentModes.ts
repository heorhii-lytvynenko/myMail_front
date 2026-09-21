import type { SelectOptionType } from '@shared/ui/SelectPicker'

export const EMPLOYMENT_MODES = [
  {
    id: 'FULL_TIME',
    displayName: 'filters.fullTime'
  },
  {
    id: 'PART_TIME',
    displayName: 'filters.partTime'
  },
  {
    id: 'FREELANCE',
    displayName: 'filters.freelance'
  },
  {
    id: 'OTHER',
    displayName: 'filters.other'
  }
] as const satisfies SelectOptionType[]

export const EMPLOYMENT_MODE_IDS = EMPLOYMENT_MODES.map((v) => v.id)
