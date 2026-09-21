import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@shared/lib/utils'
import type { FieldProps } from '../Field'
import { Field } from '../Field'

const inputVariants = cva('', {
  variants: {
    size: {
      m: 'h-9',
      l: 'h-11'
    }
  },
  defaultVariants: {
    size: 'm'
  }
})

export interface InputProps
  extends
    FieldProps,
    Omit<ComponentProps<'input'>, 'id' | 'size'>,
    VariantProps<typeof inputVariants> {}

export const Input = ({
  name,
  label,
  error,
  helperText,
  iconLeft,
  iconRight,
  renderRight,
  slotProps,
  size,
  className,
  translateError,
  required,
  ...restProps
}: InputProps) => {
  return (
    <Field
      name={name}
      label={label}
      error={error}
      helperText={helperText}
      iconLeft={iconLeft}
      iconRight={iconRight}
      renderRight={renderRight}
      translateError={translateError}
      slotProps={slotProps}
      required={required}
    >
      <input
        id={name}
        name={name}
        autoComplete='off'
        className={cn(inputVariants({ size }), className)}
        {...restProps}
      />
    </Field>
  )
}
