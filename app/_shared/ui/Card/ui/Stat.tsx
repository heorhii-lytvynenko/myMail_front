import type { ComponentProps } from 'react'
import type { IconType } from '@shared/lib/const'
import { cn } from '@shared/lib/utils'
import type { IconProps } from '@shared/ui/Icon'
import { Icon } from '@shared/ui/Icon'

type Props = Omit<IconProps, 'name'> & {
  icon: IconType
  children: React.ReactNode
  slotProps?: {
    root?: ComponentProps<'div'>
  }
}

export const Stat: React.FC<Props> = ({
  icon,
  size = 14,
  children,
  className,
  slotProps
}) => {
  if (!children) return null
  const { root } = slotProps ?? {}
  const { className: rootClassName, ...rootProps } = root ?? {}

  return (
    <div
      className={cn('flex items-center gap-2 text-slate-500', rootClassName)}
      {...rootProps}
    >
      <Icon name={icon} size={size} />
      <span className={cn('text-sm', className)}>{children}</span>
    </div>
  )
}
