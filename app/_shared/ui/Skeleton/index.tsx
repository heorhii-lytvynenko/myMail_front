import type { ComponentProps } from 'react'
import { cn } from '@shared/lib/utils'
import s from './Skeleton.module.scss'

export type SkeletonProps = ComponentProps<'div'>

export const Skeleton = ({ className }: SkeletonProps) => {
  return <div className={cn('rounded-md', s.skeleton, className)} />
}
