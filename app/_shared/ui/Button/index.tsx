import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import type { IconType } from '@shared/lib/const'
import { cn } from '@shared/lib/utils'
import { Icon } from '../Icon'
import type { SpinnerProps } from '../Spinner'
import { Spinner } from '../Spinner'

export const buttonVariants = cva(
  `
    relative inline-flex items-center justify-center gap-2 rounded-md text-sm
    font-semibold transition-all
    [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0
    [&_svg]:text-[currentColor]
    aria-disabled:pointer-events-none
    data-[loading=true]:pointer-events-none
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
  `,
  {
    variants: {
      variant: {
        primary: `
          bg-blue-600 text-white
          hover:bg-blue-600/95
          aria-disabled:opacity-40
          data-[loading=true]:opacity-40
          before:absolute before:size-full before:pointer-events-none
          before:rounded-[inherit] before:border before:border-[#FFFFFF1F]
        `,
        secondary: `
          bg-white text-slate-600 border border-slate-200
          hover:bg-slate-50 hover:text-slate-900
          aria-disabled:opacity-40
          data-[loading=true]:opacity-40
        `,
        neutral: `
          bg-slate-800 border-slate-700 border text-slate-200
          hover:bg-slate-800/95 hover:text-slate-50
          aria-disabled:opacity-40
          data-[loading=true]:opacity-40
        `,
        ghost: `
          bg-transparent text-slate-500
          hover:text-slate-900 hover:bg-gray-100
          aria-disabled:opacity-40
          data-[loading=true]:opacity-40
        `,
        text: `
          bg-transparent text-slate-500
          hover:text-slate-900
          aria-disabled:opacity-40
          data-[loading=true]:opacity-40
        `,
        link: `
          bg-transparent text-blue-700 font-medium
          hover:underline
          aria-disabled:opacity-40
          data-[loading=true]:opacity-40
        `
      },
      size: {
        xl: `
          h-11 px-6 py-2
          [&_svg]:size-4
        `,
        l: `
          h-10 px-6 py-2
          [&_svg]:size-4
        `,
        m: `
          h-9 px-6 py-2
          [&_svg]:size-4
        `,
        s: `
          h-8 px-3 py-2
          [&_svg]:size-4
        `,
        'icon-xl': `
          h-11 w-11 rounded-full shrink-0
          [&_svg]:size-4
        `,
        'icon-l': `
          h-10 w-10 rounded-full shrink-0
          [&_svg]:size-4
        `,
        'icon-m': `
          h-9 w-9 rounded-full shrink-0
          [&_svg]:size-4
        `,
        'icon-s': `
          h-8 w-8 rounded-full shrink-0
          [&_svg]:size-4
        `
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'm'
    }
  }
)

export type ButtonElementType = 'a' | 'button' | 'div'
export type AdditionalButtonPropsType<
  T extends React.ElementType
> = T extends keyof React.JSX.IntrinsicElements
  ? React.JSX.IntrinsicElements[T]
  : React.ComponentPropsWithoutRef<T>
export interface BaseButtonProps extends VariantProps<typeof buttonVariants> {
  iconLeft?: IconType
  iconRight?: IconType
  loading?: boolean
  disabled?: boolean
  className?: string
  children?: ReactNode
  type?: 'button' | 'reset' | 'submit'
  spinnerProps?: SpinnerProps
}
export type ButtonProps<
  T extends React.ElementType = 'button'
> = {
  as?: T
} & BaseButtonProps &
  AdditionalButtonPropsType<T>

export const Button = <
  T extends React.ElementType = 'button'
>({
  as,
  className,
  variant,
  size,
  loading,
  type = 'button',
  disabled,
  iconLeft,
  iconRight,
  children,
  spinnerProps,
  ...props
}: ButtonProps<T>) => {
  const Component = as || 'button'
  const isButton = Component === 'button'

  return (
    <Component
      className={cn(
        buttonVariants({
          variant,
          size
        }),
        className
      )}
      disabled={isButton ? loading || disabled : undefined}
      aria-disabled={disabled}
      data-loading={loading}
      type={isButton ? type : undefined}
      {...props}
    >
      {loading ? (
        <Spinner aria-hidden="true" {...spinnerProps} />
      ) : (
        iconLeft && <Icon name={iconLeft} aria-hidden="true" />
      )}

      {children && <span className='line-clamp-1'>{children}</span>}

      {iconRight && <Icon name={iconRight} aria-hidden="true" />}
    </Component>
  )
}
