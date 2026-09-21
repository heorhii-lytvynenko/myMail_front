import { useTranslations } from 'next-intl'
import type { ComponentProps } from 'react'
import { cn, isType } from '@shared/lib/utils'

export interface ErrorMessageProps extends ComponentProps<'p'> {
  hasTranslate?: boolean
}

export const ErrorMessage = ({
  children,
  className,
  hasTranslate,
  ...restProps
}: ErrorMessageProps) => {
  const t = useTranslations()

  if (!children) {
    return null
  }

  return (
    <p
      className={cn('text-xs font-medium text-red-500', className)}
      {...restProps}
    >
      {hasTranslate && isType.string(children) ? t(children) : children}
    </p>
  )
}
