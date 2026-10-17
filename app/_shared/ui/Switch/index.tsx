'use client'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@shared/lib/utils'

export interface SwitchProps extends ComponentProps<
  typeof SwitchPrimitive.Root
> {
  name: string
  label?: ReactNode
  slotProps?: {
    root?: ComponentProps<'label'>
  }
}

export const Switch = ({
  name,
  className,
  label,
  slotProps,
  ...props
}: SwitchProps) => {
  const { root } = slotProps ?? {}

  return (
    <label
      htmlFor={name}
      {...root}
      className={cn(
        `
          flex items-center gap-3 transition cursor-pointer text-slate-700
          select-none font-medium
          hover:text-slate-900
        `,
        root?.className
      )}
    >
      <SwitchPrimitive.Root
        id={name}
        className={cn(
          `
            data-[state=checked]:bg-slate-900
            data-[state=unchecked]:bg-slate-300
            shrink-0 rounded-full border border-transparent h-5 w-9 relative
            inline-flex items-center transition-all self-start
            data-disabled:opacity-50
            select-none
          `,
          className
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={`
            bg-slate-50 rounded-full size-[18px]
            data-[state=checked]:translate-x-[calc(100%-2px)]
            data-[state=unchecked]:translate-x-0
            pointer-events-none flex transition-transform
          `}
        />
      </SwitchPrimitive.Root>
      {label}
    </label>
  )
}
