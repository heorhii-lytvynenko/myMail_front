import type { ComponentProps, FC } from 'react'
import { cn } from '@shared/lib/utils'
import { Button } from '../Button'

export type LoadMoreButtonProps = {
  hasNextPage: boolean
} & ComponentProps<typeof Button>

export const LoadMoreButton: FC<LoadMoreButtonProps> = ({
  size = 'xl',
  variant = 'secondary',
  hasNextPage,
  className,
  ...props
}) => {
  if (!hasNextPage) {
    return null
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={cn('min-w-52 self-center', className)}
      {...props}
    />
  )
}
