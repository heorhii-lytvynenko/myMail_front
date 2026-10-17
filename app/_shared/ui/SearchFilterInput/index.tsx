'use client'
import { useTranslations } from 'next-intl'
import { FilterInput, type FilterInputProps } from '../FilterInput'

export type SearchFilterInputProps = FilterInputProps

export const SearchFilterInput = ({
  iconLeft = 'search',
  placeholder,
  ...restProps
}: FilterInputProps) => {
  const t = useTranslations('inputs.search')

  return (
    <FilterInput
      iconLeft={iconLeft}
      placeholder={placeholder ?? t('placeholder')}
      {...restProps}
    />
  )
}
