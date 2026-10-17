import type { ComponentProps } from 'react'
import { cn } from '@shared/lib/utils'

export type HelperTextProps = ComponentProps<'p'>

export const HelperText = ({
  children,
  className,
  ...restProps
}: HelperTextProps) => {
  if (!children) {
    return null
  }

  return (
    <p
      className={cn('text-xs font-medium text-orange-500', className)}
      {...restProps}
    >
      {children}
    </p>
  )
}
