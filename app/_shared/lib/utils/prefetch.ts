import type { InfiniteData } from '@tanstack/react-query'
import type { z, ZodObject } from 'zod'
import { PAGE_SIZE } from '@shared/lib/const'
import type { FetchResponse } from '@shared/lib/utils'
import type { PaginatedResponse, TotalCountResponse } from '@shared/types'

type GetTotalCount =
  | (() => Promise<FetchResponse<TotalCountResponse>>)
  | undefined
type TotalCount<T extends GetTotalCount> = T extends undefined
  ? undefined
  : number

interface Options<
  TData extends PaginatedResponse<any> = PaginatedResponse<any>,
  TSchema extends ZodObject<any> = ZodObject<any>,
  TGetTotalCount extends GetTotalCount = undefined
> {
  schema: TSchema
  searchParams: Record<string, any>
  getList: (context: {
    filters: z.infer<TSchema>
  }) => Promise<FetchResponse<TData>>
  getTotalCount?: TGetTotalCount
  initialPageParam?: number
  pageSize?: number
}

export const prefetchInfiniteList = async <
  TData extends PaginatedResponse<any> = PaginatedResponse<any>,
  TSchema extends ZodObject<any> = ZodObject<any>,
  TGetTotalCount extends GetTotalCount = undefined
>({
  schema,
  searchParams,
  getList,
  getTotalCount,
  initialPageParam = 0,
  pageSize = PAGE_SIZE
}: Options<TData, TSchema, TGetTotalCount>): Promise<{
  totalCount: TotalCount<TGetTotalCount>
  filteredCount: number
  initialData: InfiniteData<TData, number>
}> => {
  const [{ data: listData }, totalCountResponse] = await Promise.all([
    getList({
      filters: {
        ...schema.parse(searchParams),
        pageSize,
        pageNumber: initialPageParam
      }
    }),
    getTotalCount?.()
  ])

  return {
    totalCount: totalCountResponse?.data?.total as TotalCount<TGetTotalCount>,
    filteredCount: listData.page.totalElements,
    initialData: {
      pageParams: [initialPageParam],
      pages: [listData]
    }
  }
}
