import type { PaginatedResponse } from '@shared/types'
import type { TagType } from './model'

export type GetTagListResponse = PaginatedResponse<TagType>
export type GetTagResponse = TagType
