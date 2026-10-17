'use client'
import type { ComponentProps, ReactNode } from 'react'
import type { BreakpointType } from '@shared/lib/const'
import { useMediaQuery } from '@shared/lib/hooks'
import { cn } from '@shared/lib/utils'
import { getClasses } from './lib/getClasses'
import { isVisible } from './lib/isVisible'

export interface VisibleProps extends ComponentProps<'div'> {
  children?: ReactNode
  from?: BreakpointType | null
  to?: BreakpointType | null
}

export const Visible = ({
  children,
  from,
  to,
  className,
  ...rest
}: VisibleProps) => {
  const media = useMediaQuery()

  if (!isVisible({ media, from, to })) {
    return null
  }

  return (
    <div className={cn(getClasses({ from, to }), className)} {...rest}>
      {children}
    </div>
  )
}
