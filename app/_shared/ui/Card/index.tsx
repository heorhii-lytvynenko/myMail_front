import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@shared/lib/utils'
import { Button } from '../Button'
import { Action } from './ui/Action'
import { Actions } from './ui/Actions'
import { Footer } from './ui/Footer'
import { Stat } from './ui/Stat'
import { Stats } from './ui/Stats'
import { TagList } from './ui/TagList'
import { Title } from './ui/Title'

const cardVariants = cva('relative flex bg-white border border-transparent', {
  variants: {
    size: {
      lg: 'rounded-2xl px-4 py-3 shadow-sm',
      sm: 'rounded-xl px-4 py-3 shadow-sm'
    }
  },
  defaultVariants: {
    size: 'lg'
  }
})

export interface CardProps
  extends ComponentProps<'div'>, VariantProps<typeof cardVariants> {
  children?: ReactNode
  action?: ComponentProps<typeof Button>
  slotProps?: {
    content?: ComponentProps<'div'>
  }
}

export const Card = ({
  children,
  action,
  slotProps,
  className,
  size,
  ...restProps
}: CardProps) => {
  const { content } = slotProps ?? {}
  const { className: contentClassName, ...contentProps } = content ?? {}

  return (
    <div
      className={cn(
        cardVariants({ size }),
        action &&
          `
            transition-all
            notouch:hover:bg-slate-50 notouch:hover:shadow-md
            notouch:hover:border-blue-300 notouch:focus-within:bg-slate-50
            notouch:focus-within:border-blue-300 notouch:focus-within:shadow-md
          `,
        className
      )}
      {...restProps}
    >
      {action && (
        <Button
          {...{
            ...action,
            variant: 'text',
            className: cn(
              'absolute top-0 left-0 size-full opacity-0 p-0 z-[1]',
              action.className
            )
          }}
        />
      )}

      <div
        className={cn('flex flex-col gap-3 w-full', contentClassName)}
        {...contentProps}
      >
        {children}
      </div>
    </div>
  )
}

Card.Action = Action
Card.Actions = Actions
Card.Title = Title
Card.TagList = TagList
Card.Stat = Stat
Card.Stats = Stats
Card.Footer = Footer
