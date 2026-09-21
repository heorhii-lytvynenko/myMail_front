'use client'
import { useFilterSelect } from '@shared/lib/hooks'
import { Select, type SelectProps } from '../Select'
import type { SelectOptionType, SelectValueType } from '../SelectPicker'

export type FilterSelectProps<
  TValue extends SelectOptionType,
  TMultiple extends boolean
> = Omit<SelectProps<TValue, TMultiple>, 'value' | 'onChange'> & {
  onChange?: (value: SelectValueType<TValue, TMultiple>) => void
}

export const FilterSelect = <
  TValue extends SelectOptionType,
  TMultiple extends boolean
>({
  name,
  onChange,
  options,
  multiple,
  ...restProps
}: FilterSelectProps<TValue, TMultiple>) => {
  const { value, setFilterValue } = useFilterSelect({
    name,
    multiple,
    options
  })

  return (
    <Select
      name={name}
      value={value}
      onChange={(value) => {
        setFilterValue(value)
        onChange?.(value)
      }}
      options={options}
      multiple={multiple}
      {...restProps}
    />
  )
}
