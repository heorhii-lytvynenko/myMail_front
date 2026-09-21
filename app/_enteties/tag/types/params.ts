import type { z } from 'zod'
import { QueryEnum, QueryString } from '@shared/lib/schemas'
import { createParamSchema } from '@shared/lib/utils'
import { PaganationSchema } from '@shared/schemas'
import { TAG_LIST_SORT_OPTIONS_IDS } from './sort'

export const tagListParams = createParamSchema({
  ...PaganationSchema.shape,
  search: QueryString,
  sort: QueryEnum(TAG_LIST_SORT_OPTIONS_IDS)
})

export type GetTagListParams = z.infer<typeof tagListParams.Schema>
