'use client'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import type { ComponentProps } from 'react'
import { cn } from '@shared/lib/utils'
import { Icon } from '../Icon'

interface Props extends ComponentProps<typeof CheckboxPrimitive.Root> {
  label?: React.ReactNode
  boxProps?: ComponentProps<'div'>
}

export const Checkbox = ({
  className,
  label,
  ref,
  boxProps,
  ...props
}: Props) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      `
        flex w-fit items-center gap-3 transition
        hover:opacity-90
        focus-visible:outline-none
        disabled:opacity-40
      `,
      className
    )}
    {...props}
  >
    <div className='flex items-center gap-3'>
      <div
        {...boxProps}
        className={cn(
          'relative size-4 shrink-0 self-start rounded-[4px]',
          boxProps?.className
        )}
      >
        <span
          className={`
            absolute inset-0 m-auto border border-blackAlpha-10 bg-slate-250
            rounded-[inherit]
          `}
        />

        <CheckboxPrimitive.Indicator
          className={cn(
            `
              rounded-[inherit] absolute inset-0 m-auto flex items-center
              justify-center bg-blue-700 text-white
            `
          )}
        >
          <Icon name='check' size={14} />
        </CheckboxPrimitive.Indicator>
      </div>

      {label && <p>{label}</p>}
    </div>
  </CheckboxPrimitive.Root>
)

Checkbox.displayName = CheckboxPrimitive.Root.displayName
