import type { InputProps } from '../Input'
import { Input } from '../Input'

export type NumericInputProps = Omit<
  InputProps,
  'type' | 'inputMode' | 'pattern'
>

export const NumericInput = ({ onChange, ...restProps }: NumericInputProps) => {
  return (
    <Input
      type='text'
      inputMode='numeric'
      pattern='[0-9]*'
      onChange={(e) => {
        e.target.value = e.target.value.replace(/\D+/g, '')

        onChange?.(e)
      }}
      {...restProps}
    />
  )
}
