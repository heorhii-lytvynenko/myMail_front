import type { ComponentProps } from 'react'
import { cn } from '@shared/lib/utils'

export type ContainerProps = ComponentProps<'div'>

export const Container = ({ className, children }: ContainerProps) => {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-6xl flex flex-col grow gap-4 px-4',
        className
      )}
    >
      {children}
    </div>
  )
}
