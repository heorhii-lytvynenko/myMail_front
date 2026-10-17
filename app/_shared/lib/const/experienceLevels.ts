import type { SelectOptionType } from '@shared/ui/SelectPicker'

export const EXPERIENCE_LEVELS = [
  {
    id: 'INTERN',
    displayName: 'filters.intern'
  },
  {
    id: 'JUNIOR',
    displayName: 'filters.junior'
  },
  {
    id: 'MIDDLE',
    displayName: 'filters.middle'
  },
  {
    id: 'SENIOR',
    displayName: 'filters.senior'
  },
  {
    id: 'C_LEVEL',
    displayName: 'filters.cLevel'
  },
  {
    id: 'OTHER',
    displayName: 'filters.other'
  }
] as const satisfies SelectOptionType[]

export const EXPERIENCE_LEVEL_IDS = EXPERIENCE_LEVELS.map((v) => v.id)
