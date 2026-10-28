'use client'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { useId, type ComponentProps } from 'react'
import { cn } from '@shared/lib/utils'
import type { FieldProps } from '../Field'
import { Field } from '../Field'

const inputVariants = cva(`
  w-full rounded-md border border-panelBorder bg-panel px-3 text-foreground
  outline-none transition-[border-color,box-shadow]
  focus:border-accent focus:ring-3 focus:ring-accent/16
  aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-65
`, {
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
  id,
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
  loading,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...restProps
}: InputProps) => {
  const generatedId = useId()
  const fieldId = id ?? name ?? generatedId
  const description = [
    describedBy,
    helperText && (slotProps?.helperText?.id ?? `${fieldId}-hint`),
    error && (slotProps?.error?.id ?? `${fieldId}-error`)
  ].filter(Boolean).join(' ') || undefined

  return (
    <Field
      id={fieldId}
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
      loading={loading}
    >
      <input
        id={fieldId}
        name={name}
        autoComplete='off'
        required={required}
        aria-invalid={invalid ?? Boolean(error)}
        aria-describedby={description}
        className={cn(
          inputVariants({ size }),
          iconLeft && 'pl-9',
          (iconRight || loading || renderRight) && 'pr-9',
          className
        )}
        {...restProps}
      />
    </Field>
  )
}
