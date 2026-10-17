'use client'
import { useTranslations } from 'next-intl'
import { Input, type InputProps } from '../Input'

export type SearchInputProps = InputProps

export const SearchInput = ({
  iconLeft = 'search',
  placeholder,
  ...restProps
}: SearchInputProps) => {
  const t = useTranslations('inputs.search')

  return (
    <Input
      iconLeft={iconLeft}
      placeholder={placeholder ?? t('placeholder')}
      {...restProps}
    />
  )
}
