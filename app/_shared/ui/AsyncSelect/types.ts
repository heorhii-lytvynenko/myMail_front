import {
  type InfiniteData,
  type QueryFunctionContext,
  type UseInfiniteQueryOptions
} from '@tanstack/react-query'
import type { FetchResponse } from '@shared/lib/utils'
import type { PaginationType } from '@shared/schemas'
import type { PaginatedResponse } from '@shared/types'
import type { SelectOptionType, SelectPickerProps } from '../SelectPicker'

export interface AsyncSelectProps<
  TValue extends SelectOptionType,
  TMultiple extends boolean,
  TData extends PaginatedResponse<TValue>,
  TKey extends string[]
> extends Omit<
  SelectPickerProps<TValue, TMultiple>,
  'options' | 'search' | 'onSearch' | 'fixedValue'
> {
  name: string
  queryOptions: Omit<
    Partial<
      UseInfiniteQueryOptions<
        TData,
        Error,
        InfiniteData<TData>,
        [...TKey, string],
        number
      >
    >,
    'queryFn' | 'queryKey'
  > & {
    queryKey: TKey
    queryFn: (
      context: QueryFunctionContext<[...TKey, string], number> & {
        filters: PaginationType & {
          search: string
        }
      }
    ) => FetchResponse<TData> | Promise<FetchResponse<TData>>
  }
  initialIds?: {
    value: TMultiple extends true ? number[] : number
    queryOptions: {
      getQueryKey: (id: number) => string[]
      queryFn: (
        context: QueryFunctionContext<string[]> & {
          id: number
        }
      ) => FetchResponse<TValue> | Promise<FetchResponse<TValue>>
    }
  }
}
