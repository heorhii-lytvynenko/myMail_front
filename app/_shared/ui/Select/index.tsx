'use client'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { defaultGetOptionLabel } from '@shared/lib/utils'
import type { SelectOptionType, SelectPickerProps } from '../SelectPicker'
import { SelectPicker } from '../SelectPicker'

export type SelectProps<
  TValue extends SelectOptionType,
  TMultiple extends boolean = false
> = SelectPickerProps<TValue, TMultiple>

export const Select = <
  TValue extends SelectOptionType,
  TMultiple extends boolean = false
>({
  options: initialOptions,
  search: initialSearch,
  getOptionLabel = defaultGetOptionLabel,
  onSearch,
  translateOptionLabel,
  ...restProps
}: SelectProps<TValue, TMultiple>) => {
  const t = useTranslations()
  const [options, setOptions] = useState(initialOptions)
  const [search, setSearch] = useState(initialSearch ?? '')

  useEffect(() => {
    setOptions(options)
  }, [initialOptions])

  useEffect(() => {
    setSearch(search)
  }, [initialSearch])

  return (
    <SelectPicker
      search={search}
      options={options}
      onSearch={(search) => {
        if (onSearch) {
          return onSearch(search)
        }

        setOptions(
          initialOptions.filter((option: TValue) => {
            const optionLabel = String(getOptionLabel(option))
            const label = translateOptionLabel ? t(optionLabel) : optionLabel

            return label
              .trim()
              .toLowerCase()
              .includes(search.trim().toLowerCase())
          })
        )

        setSearch(search)
      }}
      translateOptionLabel={translateOptionLabel}
      getOptionLabel={getOptionLabel}
      {...restProps}
    />
  )
}
