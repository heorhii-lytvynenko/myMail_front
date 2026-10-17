import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@shared/lib/utils'

interface FieldIconProps extends ComponentProps<'div'> {
  side: 'left' | 'right'
  children?: ReactNode
}

export const FiledIcon = ({ side, children }: FieldIconProps) => {
  return (
    <div
      data-icon={side}
      className={cn(
        `
          absolute top-0 flex h-full justify-center items-center aspect-square
          pointer-events-none
        `,
        side === 'left' ? 'left-0' : 'right-0'
      )}
    >
      {children}
    </div>
  )
}
