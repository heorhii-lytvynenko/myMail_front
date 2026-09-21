import type { FC, SVGProps } from 'react'
import type { IconType } from '@shared/lib/const'
import { ICONS } from '@shared/lib/const'
import { cn } from '@shared/lib/utils'

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconType | undefined
  size?: number
}

export const Icon: FC<IconProps> = ({ name, size, className, ...svgProps }) => {
  const SvgIcon = ICONS[name!]
  const sizeProps = size ? { width: size, height: size } : {}

  if (!SvgIcon) {
    return null
  }

  return (
    <SvgIcon
      className={cn('shrink-0 text-s', className)}
      {...sizeProps}
      {...svgProps}
    />
  )
}
