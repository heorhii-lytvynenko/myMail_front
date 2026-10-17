import type { ComponentProps } from 'react'
import { cn } from '@shared/lib/utils'
import type { IconProps } from '../Icon'
import { Icon } from '../Icon'

type IconPublicKeys = 'name'
interface Props extends Pick<IconProps, IconPublicKeys>, ComponentProps<'div'> {
  slotProps?: {
    icon?: Omit<IconProps, IconPublicKeys>
  }
}

export const IconBox = ({ name, slotProps, className, ...rest }: Props) => {
  const { icon } = slotProps ?? {}

  return (
    <div
      className={cn(
        `
          flex items-center justify-center size-10 rounded-md bg-slate-50
          shrink-0
        `,
        className
      )}
      {...rest}
    >
      <Icon {...icon} className={cn('size-1/2', icon?.className)} name={name} />
    </div>
  )
}
