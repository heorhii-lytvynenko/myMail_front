import { cn } from '@shared/lib/utils'

export const Footer = ({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        `
          flex w-full items-center justify-between border-t border-slate-100
          pt-2 text-xs text-slate-500 mt-auto
        `,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
