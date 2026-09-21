import type { ComponentProps } from 'react'
import { cn } from '@shared/lib/utils'
import type { IconProps } from '../Icon'
import { Icon } from '../Icon'

export interface LogoIconProps extends Omit<IconProps, 'name'> {
  slotProps?: {
    root?: ComponentProps<'div'>
  }
}

export const LogoIcon = ({ slotProps, ...iconProps }: LogoIconProps) => {
  const { root } = slotProps ?? {}
  const { className: rootClassName, ...restRootProps } = root ?? {}

  return (
    <div
      className={cn(
        `
          size-9 rounded-lg bg-slate-100 flex items-center justify-center
          shrink-0
        `,
        rootClassName
      )}
      {...restRootProps}
    >
      <Icon name='logo' size={24} {...iconProps} />
    </div>
  )
}
