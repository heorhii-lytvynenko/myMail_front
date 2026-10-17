import type { InfiniteData } from '@tanstack/react-query'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { EMPTY_ARRAY } from '@shared/lib/const'
import { useDebounceValue } from '@shared/lib/hooks'
import { getNextPageParam, getPreviousPageParam } from '@shared/lib/utils'
import type { PaginatedResponse } from '@shared/types'
import type { SelectOptionType } from '@shared/ui/SelectPicker'
import type { AsyncSelectProps } from '../types'

interface Options<
  TValue extends SelectOptionType,
  TMultiple extends boolean = false,
  TData extends PaginatedResponse<TValue> = PaginatedResponse<TValue>,
  TKey extends string[] = string[]
> {
  queryOptions: AsyncSelectProps<TValue, TMultiple, TData, TKey>['queryOptions']
}

export const useLoadOptions = <
  TValue extends SelectOptionType,
  TMultiple extends boolean = false,
  TData extends PaginatedResponse<TValue> = PaginatedResponse<TValue>,
  TKey extends string[] = string[]
>({
  queryOptions
}: Options<TValue, TMultiple, TData, TKey>) => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounceValue(search)
  const [optionsQueryEnabled, setOptionsQueryEnabled] = useState(false)
  const {
    queryFn: optionsQueryFn,
    queryKey: optionsQueryKey,
    ...restInfinityOptions
  } = queryOptions

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<TData, Error, InfiniteData<TData>, string[], number>({
      queryKey: [...optionsQueryKey, debouncedSearch],
      queryFn: async (context: any) => {
        const { data } = await optionsQueryFn({
          ...context,
          filters: {
            search,
            pageSize: 20,
            pageNumber: context.pageParam
          }
        })

        return data
      },
      initialPageParam: 0,
      getNextPageParam: getNextPageParam,
      getPreviousPageParam: getPreviousPageParam,
      enabled: optionsQueryEnabled,
      ...restInfinityOptions
    } as any)

  return {
    options: data?.pages.flatMap((page) => page.pageElements) || EMPTY_ARRAY,
    isOptionsLoading: isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    search,
    setSearch,
    setOptionsQueryEnabled
  }
}
