import type { FC, HTMLAttributes } from 'react'
import { cn } from '@shared/lib/utils'
import s from './Spinner.module.scss'

export type SpinnerProps = HTMLAttributes<HTMLDivElement>

export const Spinner: FC<SpinnerProps> = ({ className, ...restProps }) => {
  return (
    <div
      className={cn(
        `
          inline-block size-4 rounded-full border-2 border-current
          border-b-transparent
        `,
        s.main,
        className
      )}
      {...restProps}
    />
  )
}
