import type { SelectOptionType } from '@shared/ui/SelectPicker'

export const WORKSTYLES = [
  {
    id: 'REMOTE',
    displayName: 'filters.remote'
  },
  {
    id: 'HYBRID',
    displayName: 'filters.hybrid'
  },
  {
    id: 'OFFICE',
    displayName: 'filters.office'
  },
  {
    id: 'OTHER',
    displayName: 'filters.other'
  }
] as const satisfies SelectOptionType[]

export const WORKSTYLES_IDS = WORKSTYLES.map((v) => v.id)
