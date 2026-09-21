'use client'
import type { QueryFunctionContext } from '@tanstack/react-query'
import { useFilterSelect } from '@shared/lib/hooks'
import { toNumberArray, type FetchResponse } from '@shared/lib/utils'
import type { PaginatedResponse } from '@shared/types'
import { AsyncSelect, type AsyncSelectProps } from '../AsyncSelect'
import type { SelectOptionType, SelectValueType } from '../SelectPicker'

export type FilterAsyncSelectProps<
  TValue extends SelectOptionType,
  TMultiple extends boolean = false,
  TData extends PaginatedResponse<TValue> = PaginatedResponse<TValue>,
  TKey extends string[] = string[]
> = Omit<
  AsyncSelectProps<TValue, TMultiple, TData, TKey>,
  'value' | 'onChange' | 'initialIds'
> & {
  onChange?: (value: SelectValueType<TValue, TMultiple>) => void
  initialIds: {
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

export const FilterAsyncSelect = <
  TValue extends SelectOptionType,
  TMultiple extends boolean = false,
  TData extends PaginatedResponse<TValue> = PaginatedResponse<TValue>,
  TKey extends string[] = string[]
>({
  name,
  onChange,
  multiple,
  initialIds,
  ...restProps
}: FilterAsyncSelectProps<TValue, TMultiple, TData, TKey>) => {
  const { value, paramValue, setFilterValue } = useFilterSelect<
    TValue,
    TMultiple
  >({ name, multiple })

  return (
    <AsyncSelect
      name={name}
      value={value}
      initialIds={{
        value: toNumberArray(paramValue),
        ...(initialIds as any)
      }}
      onChange={(value) => {
        setFilterValue(value)
        onChange?.(value)
      }}
      multiple={multiple}
      {...restProps}
    />
  )
}
