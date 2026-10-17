import { cn } from '@shared/lib/utils'

export const Actions = ({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn('relative z-10 flex items-center gap-0.5', className)}
      {...props}
    >
      {children}
    </div>
  )
}
