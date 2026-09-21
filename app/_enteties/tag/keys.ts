import { toSearchString } from '@shared/lib/utils'
import type { GetTagListParams } from './types'

export const tagKeys = {
  list: (filters?: GetTagListParams) => [`tag:list:${toSearchString(filters)}`],
  detail: (id: string) => [`tag:detail:${id}`]
}
