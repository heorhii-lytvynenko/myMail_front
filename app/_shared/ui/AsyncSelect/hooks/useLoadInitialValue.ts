import type { QueryFunctionContext } from '@tanstack/react-query'
import { useQueries } from '@tanstack/react-query'
import { useEffect, useRef, useMemo } from 'react'
import { equalIds } from '@shared/lib/utils'
import type { PaginatedResponse } from '@shared/types'
import type { SelectOptionType, SelectValueType } from '@shared/ui/SelectPicker'
import type { AsyncSelectProps } from '../types'

interface Options<
  TValue extends SelectOptionType,
  TMultiple extends boolean = false,
  TData extends PaginatedResponse<TValue> = PaginatedResponse<TValue>,
  TKey extends string[] = string[]
> {
  value: SelectValueType<TValue, TMultiple>
  multiple: TMultiple | undefined
  onChange: AsyncSelectProps<TValue, TMultiple, TData, TKey>['onChange']
  initialIds: AsyncSelectProps<TValue, TMultiple, TData, TKey>['initialIds']
}

function getIds(value: number | number[] | undefined): number[]
function getIds(
  value: SelectOptionType | SelectOptionType[] | null
): Array<string | number>
function getIds(
  value: SelectOptionType | SelectOptionType[] | number | number[] | null | undefined
): Array<string | number> {
  return (Array.isArray(value) ? value : [value])
    .map((value) =>
      typeof value === 'object' && value !== null && Object.hasOwn(value, 'id')
        ? value?.id
        : value
    )
    .filter((v): v is string | number => v !== undefined && v !== null)
}

export const useLoadInitialValue = <
  TValue extends SelectOptionType,
  TMultiple extends boolean = false,
  TData extends PaginatedResponse<TValue> = PaginatedResponse<TValue>,
  TKey extends string[] = string[]
>({
  value: realValue,
  multiple,
  onChange,
  initialIds: initialIdsCongif
}: Options<TValue, TMultiple, TData, TKey>) => {
  const { value, queryOptions: initialIdsQueryOptions } = initialIdsCongif ?? {}
  const { queryFn, getQueryKey } = initialIdsQueryOptions ?? {}

  const ids = useMemo(() => getIds(value), [value])
  const idsKey = JSON.stringify(ids)
  const initializedRef = useRef<string | null>(null)

  const { previewData, isFetching } = useQueries({
    queries: (queryFn && getQueryKey ? ids : []).map((id) => ({
      queryKey: getQueryKey!(id),
      queryFn: async (context: QueryFunctionContext<string[]>) => {
        if (!queryFn) {
          return
        }

        try {
          const { data } = await queryFn({ ...context, id })

          return data
        } catch {
          return null
        }
      }
    })),
    combine: (queries) => ({
      previewData: queries.map((query) => query.data).filter((v) => !!v),
      isFetching: queries.some((query) => query.isFetching)
    })
  })

  useEffect(() => {
    if (isFetching || !ids.length || initializedRef.current === idsKey || !onChange) return
    if (!equalIds(getIds(previewData), ids)) return
    initializedRef.current = idsKey
    if (equalIds(getIds(realValue), ids)) return
    onChange((multiple ? previewData : previewData[0]) as SelectValueType<TValue, TMultiple>)
  }, [previewData, multiple, isFetching, onChange, ids, idsKey, realValue])

  return {
    isLoading: isFetching
  }
}
