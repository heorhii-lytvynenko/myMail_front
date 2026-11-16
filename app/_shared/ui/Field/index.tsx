import type { ComponentProps, ReactNode } from 'react'
import type { IconType } from '@shared/lib/const'
import { cn } from '@shared/lib/utils'
import { ErrorMessage, type ErrorMessageProps } from '../ErrorMessage'
import type { HelperTextProps } from '../HelperText'
import { HelperText } from '../HelperText'
import { Icon, type IconProps } from '../Icon'
import { Spinner } from '../Spinner'
import { FiledIcon } from './ui/FiledIcon'

export interface FieldProps {
  id?: string
  name?: string
  error?: ReactNode
  label?: ReactNode | null
  helperText?: ReactNode
  iconLeft?: IconType | null
  iconRight?: IconType | null
  renderRight?: () => ReactNode
  loading?: boolean
  required?: boolean
  children?: ReactNode
  translateError?: boolean
  slotProps?: {
    root?: ComponentProps<'div'>
    label?: Omit<ComponentProps<'label'>, 'htmlFor'>
    iconLeft?: Omit<IconProps, 'name'>
    iconRight?: Omit<IconProps, 'name'>
    helperText?: HelperTextProps
    error?: ErrorMessageProps
  }
}

export const Field = ({
  id,
  name,
  error,
  label,
  helperText,
  iconLeft,
  iconRight,
  renderRight,
  loading,
  required,
  children,
  translateError,
  slotProps
}: FieldProps) => {
  const {
    root,
    label: labelProps,
    iconLeft: iconLeftProps,
    iconRight: iconRightProps,
    helperText: helperTextProps,
    error: errorProps
  } = slotProps ?? {}
  const { className, ...restProps } = root ?? {}
  const { className: labelClassName, ...restLabelProps } = labelProps ?? {}
  const fieldId = id ?? name

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-1 text-slate-700',
        loading && 'pointer-events-none',
        className
      )}
      data-icon-left={Boolean(iconLeft)}
      data-icon-right={Boolean(iconRight)}
      {...restProps}
    >
      {label && (
        <div className='flex items-baseline gap-1'>
          <label
            htmlFor={fieldId}
            className={cn('text-sm font-medium text-slate-900', labelClassName)}
            {...restLabelProps}
          >
            {label}
          </label>
          {required && <span className='text-blue-700' aria-hidden='true'>*</span>}
        </div>
      )}

      <div className='relative flex w-full grow'>
        {iconLeft && (
          <FiledIcon side='left'>
            <Icon name={iconLeft} size={16} {...iconLeftProps} />
          </FiledIcon>
        )}

        {children}

        {iconRight && !loading && (
          <FiledIcon side='right'>
            <Icon name={iconRight} size={16} {...iconRightProps} />
          </FiledIcon>
        )}

        {loading && (
          <FiledIcon side='right'>
            <Spinner className='size-4' />
          </FiledIcon>
        )}

        {renderRight?.()}
      </div>

      <HelperText id={fieldId ? `${fieldId}-hint` : undefined} {...helperTextProps}>{helperText}</HelperText>
      <ErrorMessage id={fieldId ? `${fieldId}-error` : undefined} hasTranslate={translateError} {...errorProps}>{error}</ErrorMessage>
    </div>
  )
}
