import { cn } from '@shared/lib/utils'

export const Stats = ({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div className={cn('flex gap-4', className)} {...props}>
      {children}
    </div>
  )
}
