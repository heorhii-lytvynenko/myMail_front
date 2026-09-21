'use client'
import { useFilterInput } from '@shared/lib/hooks'
import { NumericInput, type NumericInputProps } from '../NumericInput'

export interface FilterNumericInputProps extends Omit<
  NumericInputProps,
  'value'
> {
  debounceDelay?: number
}

export const FilterNumericInput = ({
  name,
  debounceDelay,
  onChange,
  onKeyDown,
  onBlur,
  ...restProps
}: FilterNumericInputProps) => {
  const { value, setValue, handleKeyDown, handleBlur } = useFilterInput({
    name,
    debounceDelay,
    normalize: (v) => (Number(v) ? v : '')
  })

  return (
    <NumericInput
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
