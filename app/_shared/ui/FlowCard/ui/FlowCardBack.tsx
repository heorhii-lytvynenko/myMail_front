import { cn } from '@shared/lib/utils'
import type { FlowCardLinkProps } from './FlowCardLink'
import { _FlowCardLink } from './FlowCardLink'

export const _FlowCardBack = ({
  className,
  href,
  ...rest
}: FlowCardLinkProps) => {
  return (
    <_FlowCardLink
      href={href}
      iconLeft='arrowLeft'
      className={cn('border-t p-3 border-slate-100', className)}
      {...rest}
    />
  )
}
