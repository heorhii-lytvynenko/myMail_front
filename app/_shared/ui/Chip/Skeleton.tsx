import { cn } from '@shared/lib/utils'
import { Skeleton, type SkeletonProps } from '../Skeleton'

export type ChipSkeletonProps = SkeletonProps

export const ChipSkeleton = ({
  className,
  ...restProps
}: ChipSkeletonProps) => {
  return <Skeleton className={cn('w-14 h-6', className)} {...restProps} />
}
