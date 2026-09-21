import type { ComponentProps } from 'react'
import { Button } from '../Button'
import { BackLink } from './BackLink'

export type BackButtonProps = {
  path: string
} & ComponentProps<typeof Button<typeof BackLink>>

export const BackButton = ({
  variant = 'text',
  iconLeft = 'arrowLeft',
  ...restProps
}: BackButtonProps) => {
  return (
    <Button
      as={BackLink}
      variant={variant}
      iconLeft={iconLeft}
      {...restProps}
    />
  )
}
