'use client'
import { defaultGetOptionLabel } from '@shared/lib/utils'
import type { PaginatedResponse } from '@shared/types'
import type { SelectOptionType } from '../SelectPicker'
import { SelectPicker } from '../SelectPicker'
import { useLoadInitialValue } from './hooks/useLoadInitialValue'
import { useLoadOptions } from './hooks/useLoadOptions'
import type { AsyncSelectProps } from './types'

export const AsyncSelect = <
  TValue extends SelectOptionType,
  TMultiple extends boolean = false,
  TData extends PaginatedResponse<TValue> = PaginatedResponse<TValue>,
  TKey extends string[] = string[]
>({
  name,
  queryOptions,
  getOptionLabel = defaultGetOptionLabel,
  value,
  onChange,
  multiple,
  slotProps,
  initialIds,
  ...restProps
}: AsyncSelectProps<TValue, TMultiple, TData, TKey>) => {
  const { isLoading } = useLoadInitialValue<TValue, TMultiple, TData, TKey>({
    value,
    multiple,
    onChange,
    initialIds
  })

  const {
    search,
    setSearch,
    options,
    setOptionsQueryEnabled,
    isOptionsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useLoadOptions<TValue, TMultiple, TData, TKey>({ queryOptions })

  return (
    <SelectPicker
      name={name}
      multiple={multiple}
      search={search}
      options={options}
      loading={isLoading}
      optionsLoading={isOptionsLoading}
      value={value}
      onChange={onChange}
      onSearch={(search) => setSearch(search)}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          setOptionsQueryEnabled(true)
        }
      }}
      getOptionLabel={getOptionLabel}
      slotProps={{
        ...slotProps,
        infiniteScroll: {
          onNext: fetchNextPage,
          hasMore: hasNextPage,
          isLoading: isFetchingNextPage,
          ...slotProps?.infiniteScroll
        }
      }}
      {...restProps}
    />
  )
}
