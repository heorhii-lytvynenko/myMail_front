import type { SortOptionType } from '@shared/types/sort'
import type { TagType } from './model'

export const TAG_LIST_SORT_OPTIONS = [
  {
    id: 'name,desc',
    displayName: ''
  }
] as const satisfies SortOptionType<TagType>[]

export const TAG_LIST_SORT_OPTIONS_IDS = TAG_LIST_SORT_OPTIONS.map((v) => v.id)
