'use client'
import { useFilterInput } from '@shared/lib/hooks'
import type { InputProps } from '../Input'
import { Input } from '../Input'

export interface FilterInputProps extends Omit<InputProps, 'value'> {
  debounceDelay?: number
}

export const FilterInput = ({
  name,
  debounceDelay,
  onChange,
  onKeyDown,
  onBlur,
  ...restProps
}: FilterInputProps) => {
  const { value, setValue, handleBlur, handleKeyDown } = useFilterInput({
    name,
    debounceDelay
  })

  return (
    <Input
      name={name}
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
        onChange?.(e)
      }}
      onBlur={(e) => {
        handleBlur()
        onBlur?.(e)
      }}
      onKeyDown={(e) => {
        handleKeyDown(e)
        onKeyDown?.(e)
      }}
      {...restProps}
    />
  )
}
