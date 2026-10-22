'use client'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { defaultGetOptionLabel } from '@shared/lib/utils'
import type { SelectOptionType, SelectPickerProps } from '../SelectPicker'
import { SelectPicker } from '../SelectPicker'

export type SelectProps<TValue extends SelectOptionType, TMultiple extends boolean = false> = SelectPickerProps<TValue, TMultiple>
export const Select = <TValue extends SelectOptionType, TMultiple extends boolean = false>({
  options: initialOptions, search: initialSearch, getOptionLabel = defaultGetOptionLabel,
  onSearch, translateOptionLabel, ...restProps
}: SelectProps<TValue, TMultiple>) => {
  const t = useTranslations()
  const [localSearch, setLocalSearch] = useState('')
  const search = initialSearch ?? localSearch
  const options = onSearch ? initialOptions : initialOptions.filter(option => {
    const label = String(getOptionLabel(option))
    return (translateOptionLabel ? t(label) : label).trim().toLowerCase().includes(search.trim().toLowerCase())
  })
  return <SelectPicker search={search} options={options} onSearch={value => { if (onSearch) onSearch(value); else setLocalSearch(value) }}
    translateOptionLabel={translateOptionLabel} getOptionLabel={getOptionLabel} {...restProps} />
}
