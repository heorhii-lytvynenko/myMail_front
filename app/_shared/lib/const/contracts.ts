import type { SelectOptionType } from '@shared/ui/SelectPicker'

export const CONTRACTS = [
  {
    id: 'B2B',
    displayName: 'filters.b2b'
  },
  {
    id: 'PERMANENT',
    displayName: 'filters.permanent'
  },
  {
    id: 'INTERNSHIP',
    displayName: 'filters.internship'
  },
  {
    id: 'SPECIFIC_TASK_CONTRACT',
    displayName: 'filters.specificTaskContract'
  },
  {
    id: 'OTHER',
    displayName: 'filters.other'
  }
] as const satisfies SelectOptionType[]

export const CONTRACT_IDS = CONTRACTS.map((v) => v.id)
