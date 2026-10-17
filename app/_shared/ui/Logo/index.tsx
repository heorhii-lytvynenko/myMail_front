import type { ComponentProps } from 'react'
import { Link } from '@shared/i18n/navigation'
import { cn } from '@shared/lib/utils'
import type { LogoIconProps } from '../LogoIcon'
import { LogoIcon } from '../LogoIcon'

export interface LogoProps extends Partial<ComponentProps<typeof Link>> {
  slotProps?: {
    icon?: LogoIconProps
    text?: ComponentProps<'p'>
  }
}

export const Logo = ({ slotProps, className, ...restProps }: LogoProps) => {
  const { icon, text: textProps } = slotProps ?? {}
  const { className: textClassName, ...restTextProps } = textProps ?? {}

  return (
    <Link
      href='/'
      className={cn(
        `
          flex items-center shrink-0 gap-2
          hover:opacity-80
          transition
        `,
        className
      )}
      {...restProps}
    >
      <LogoIcon {...icon} />

      <p className={cn('text-lg', textClassName)} {...restTextProps}>
        My mail
      </p>
    </Link>
  )
}
