import { isType } from '@shared/lib/utils'
import type { InputProps } from '../Input'
import { Input } from '../Input'
import { formatDateInput } from './lib/formatDateInput'

export interface DateInputProps extends Omit<
  InputProps,
  'type' | 'inputMode' | 'pattern' | 'onChange'
> {
  onChange?: (value: string) => void
}

export const DateInput = ({
  value,
  onChange,
  ...restProps
}: DateInputProps) => {
  return (
    <Input
      type='text'
      inputMode='numeric'
      pattern='[0-9-]*'
      value={value}
      placeholder='YYYY-MM-DD'
      onChange={(e) => {
        const prev = isType.string(value) ? value : ''
        const next = e.target.value
        const isDeleting = next.length < prev.length
        const endsWithDash = prev.endsWith('-')

        let formatted: string

        if (isDeleting && endsWithDash) {
          formatted = prev.slice(0, -2)
        } else {
          formatted = formatDateInput(next)
        }

        onChange?.(formatted)
      }}
      {...restProps}
    />
  )
}
