import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@shared/lib/utils'

const dividerVariants = cva('bg-slate-100', {
  variants: {
    direction: {
      horizontal: 'w-full min-h-px max-h-px',
      vertical: 'min-w-px max-w-px h-full'
    }
  },
  defaultVariants: {
    direction: 'horizontal'
  }
})

type DividerDirection = VariantProps<typeof dividerVariants>['direction']

interface DividerProps extends ComponentProps<'div'> {
  direction?: DividerDirection
}

export const Divider = ({
  className,
  direction,
  ...restProps
}: DividerProps) => {
  return (
    <div
      className={cn(dividerVariants({ direction }), className)}
      {...restProps}
    />
  )
}

export const InlineDivider = ({
  className,
  children,
  ...restProps
}: ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        `
          flex items-center gap-2 whitespace-nowrap uppercase text-slate-500
          text-xs
        `,
        className
      )}
      {...restProps}
    >
      <Divider />
      {children}
      <Divider />
    </div>
  )
}
