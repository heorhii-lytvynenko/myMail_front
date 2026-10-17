import type { ComponentProps } from 'react'
import { cn } from '@shared/lib/utils'
import type { CardProps } from '@shared/ui/Card'
import { Card } from '@shared/ui/Card'
import type { IconProps } from '@shared/ui/Icon'
import { Icon } from '@shared/ui/Icon'
import { _FlowCardBack } from './ui/FlowCardBack'
import { _FlowCardImage } from './ui/FlowCardImage'
import { _FlowCardLink } from './ui/FlowCardLink'

type FlowCardProps = CardProps

export const FlowCard = ({ className, slotProps, ...rest }: FlowCardProps) => {
  const { content, ...restSlotProps } = slotProps ?? {}
  const { className: contentClassName, ...contentProps } = content ?? {}

  return (
    <Card
      className={cn(
        `
          p-0 overflow-hidden w-full mx-auto
          sm:max-w-[500px]
          lg:max-w-full
        `,
        className
      )}
      slotProps={{
        content: {
          className: cn(
            `
              grid gap-0
              lg:grid-cols-[1fr_1.15fr]
            `,
            contentClassName
          ),
          ...contentProps
        },
        ...restSlotProps
      }}
      {...rest}
    />
  )
}

FlowCard.Content = ({ className, ...rest }: ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        `
          flex flex-col w-full gap-8 justify-center p-6
          sm:px-[68px] sm:py-12
        `,
        className
      )}
      {...rest}
    />
  )
}

interface FlowCardIconProps extends IconProps {
  slotProps?: {
    root?: ComponentProps<'div'>
  }
}

FlowCard.Icon = ({ slotProps, ...rest }: FlowCardIconProps) => {
  const { root } = slotProps ?? {}
  const { className, ...restRoot } = root ?? {}

  return (
    <div
      className={cn(
        `
          flex items-center justify-center shrink-0 rounded-full bg-blue-50
          size-16 self-center text-blue-700
        `,
        className
      )}
      {...restRoot}
    >
      <Icon size={32} {...rest} />
    </div>
  )
}

FlowCard.Header = ({ className, ...rest }: ComponentProps<'div'>) => {
  return <div className={cn('flex flex-col gap-3', className)} {...rest} />
}

FlowCard.Title = ({ className, ...rest }: ComponentProps<'h1'>) => {
  return (
    <h1
      className={cn(
        `
          text-2xl text-center
          sm:text-3xl
        `,
        className
      )}
      {...rest}
    />
  )
}

FlowCard.Text = ({ className, ...rest }: ComponentProps<'p'>) => {
  return <p className={cn('text-center text-slate-500', className)} {...rest} />
}

FlowCard.Link = _FlowCardLink
FlowCard.Back = _FlowCardBack

FlowCard.Image = _FlowCardImage
