import type { ComponentProps, ReactNode } from 'react'
import type { IconType } from '@shared/lib/const'
import { cn } from '@shared/lib/utils'
import { ErrorMessage } from '../ErrorMessage'
import type { HelperTextProps } from '../HelperText'
import { HelperText } from '../HelperText'
import { Icon, type IconProps } from '../Icon'
import { Spinner } from '../Spinner'
import { FiledIcon } from './ui/FiledIcon'

export interface FieldProps {
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
    root?: Omit<ComponentProps<'label'>, 'htmlFor'>
    iconLeft?: Omit<IconProps, 'name'>
    iconRight?: Omit<IconProps, 'name'>
    helperText?: HelperTextProps
  }
}

export const Field = ({
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
    iconLeft: iconLeftProps,
    iconRight: iconRightProps,
    helperText: helperTextProps
  } = slotProps ?? {}
  const { className, ...restProps } = root ?? {}

  return (
    <label
      htmlFor={name}
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
        <p className='text-slate-900 text-sm font-medium'>
          {label} {required && <span className='text-blue-700'>*</span>}
        </p>
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

      <HelperText {...helperTextProps}>{helperText}</HelperText>
      <ErrorMessage hasTranslate={translateError}>{error}</ErrorMessage>
    </label>
  )
}
