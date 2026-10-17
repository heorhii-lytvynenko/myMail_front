import { cn } from '@shared/lib/utils'
import { Skeleton, type SkeletonProps } from '../Skeleton'

export type AvatarSkeletonProps = SkeletonProps

export const AvatarSkeleton = ({
  className,
  ...restProps
}: AvatarSkeletonProps) => {
  return (
    <Skeleton
      className={cn('size-10 shrink-0 rounded-full', className)}
      {...restProps}
    />
  )
}
