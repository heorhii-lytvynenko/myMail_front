'use client'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import type { ComponentProps } from 'react'
import { cn } from '@shared/lib/utils'

export type PopoverProps = ComponentProps<typeof PopoverPrimitive.Root>

export const Popover = ({ ...props }: PopoverProps) => {
  return <PopoverPrimitive.Root {...props} />
}

export type PopoverTriggerProps = ComponentProps<
  typeof PopoverPrimitive.Trigger
>

Popover.Trigger = PopoverPrimitive.Trigger

export type PopoverAnchorProps = ComponentProps<typeof PopoverPrimitive.Anchor>

Popover.Anchor = PopoverPrimitive.Anchor

export type PopoverContentProps = ComponentProps<
  typeof PopoverPrimitive.Content
>

const PopoverContent = ({
  className,
  align = 'start',
  sideOffset = 4,
  ref,
  onCloseAutoFocus,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        `
          z-50 w-[280px] origin-[--radix-popover-content-transform-origin]
          bg-white shadow-md rounded-md border border-bg-blackAlpha-10
          data-[state=open]:animate-in
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0
          data-[state=open]:fade-in-0
          data-[state=closed]:zoom-out-95
          data-[state=open]:zoom-in-95
          data-[side=bottom]:slide-in-from-top-2
          data-[side=left]:slide-in-from-right-2
          data-[side=right]:slide-in-from-left-2
          data-[side=top]:slide-in-from-bottom-2
        `,
        className
      )}
      onCloseAutoFocus={(event) => {
        if (onCloseAutoFocus) {
          return onCloseAutoFocus(event)
        } else {
          event.preventDefault()
        }
      }}
      {...props}
    />
  </PopoverPrimitive.Portal>
)

Popover.Content = PopoverContent
