'use client'
import type {
  InfiniteData,
  QueryFunctionContext,
  UseInfiniteQueryOptions
} from '@tanstack/react-query'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import type { z, ZodObject } from 'zod'
import { EMPTY_ARRAY, PAGE_SIZE } from '@shared/lib/const'
import {
  cn,
  getNextPageParam,
  getPreviousPageParam,
  type FetchResponse
} from '@shared/lib/utils'
import type { PaginatedResponse } from '@shared/types'
import {
  LoadMoreButton,
  type LoadMoreButtonProps
} from '@shared/ui/LoadMoreButton'
import type { ListProps } from '../List'
import { List } from '../List'
import type { NoDataProps } from '../NoData'
import { NoData } from '../NoData'
import { useInitialInfiniteList } from './InitialInfiniteListProvider'

interface Props<
  TData extends PaginatedResponse<unknown> = PaginatedResponse<unknown>,
  TSchema extends ZodObject = ZodObject
> {
  getQueryKey: (filters: z.infer<TSchema>) => string[]
  infinityOptions: Omit<
    Partial<
      UseInfiniteQueryOptions<
        TData,
        Error,
        InfiniteData<TData>,
        string[],
        number
      >
    >,
    'queryFn' | 'queryKey' | 'initialData'
  > & {
    queryFn: (
      context: QueryFunctionContext<string[], number> & {
        filters: z.infer<TSchema>
      }
    ) => FetchResponse<TData> | Promise<FetchResponse<TData>>
  }
  listOptions: Omit<ListProps<TData['pageElements'][number]>, 'data'>
  schema: TSchema
  slotProps?: {
    noData?: NoDataProps
    loadMoreButton?: Partial<LoadMoreButtonProps>
  }
  pageSize?: number
}

export const InfiniteList = <
  TData extends PaginatedResponse<unknown> = PaginatedResponse<unknown>,
  TSchema extends ZodObject = ZodObject
>({
  infinityOptions,
  getQueryKey,
  slotProps,
  listOptions,
  pageSize = PAGE_SIZE,
  schema
}: Props<TData, TSchema>) => {
  const params = useSearchParams()
  const initialData = useInitialInfiniteList<TData>()
  const filters = schema.parse(Object.fromEntries(params.entries()))
  const { queryFn, ...restInfinityOptions } = infinityOptions
  const { noData, loadMoreButton } = slotProps ?? {}
  const { className: noDataClassName, ...restNoDataProps } = noData ?? {}

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<TData, Error, InfiniteData<TData>, string[], number>({
      initialData,
      queryKey: getQueryKey(filters),
      queryFn: async (context: QueryFunctionContext<string[], number>) => {
        const { data } = await queryFn({
          ...context,
          filters: {
            ...filters,
            pageSize,
            pageNumber: context.pageParam
          }
        })

        return data
      },
      initialPageParam: 0,
      getNextPageParam: getNextPageParam,
      getPreviousPageParam: getPreviousPageParam,
      ...restInfinityOptions
    })

  const fullData =
    data?.pages.flatMap((page) => page.pageElements) || EMPTY_ARRAY

  if (!fullData.length) {
    return (
      <NoData
        className={cn('grow-0 min-h-[300px]', noDataClassName)}
        {...restNoDataProps}
      />
    )
  }

  return (
    <div className='flex flex-col gap-8'>
      <List data={fullData} {...listOptions} />

      <LoadMoreButton
        hasNextPage={hasNextPage}
        onClick={() => fetchNextPage()}
        loading={isFetchingNextPage}
        {...loadMoreButton}
      />
    </div>
  )
}
