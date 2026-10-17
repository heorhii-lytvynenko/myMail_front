'use client'
import type { ComponentProps, ComponentPropsWithoutRef } from 'react'
import { useEffect, useRef } from 'react'
import { cn } from '@shared/lib/utils'

export interface InfiniteScrollProps extends ComponentProps<'div'> {
  hasMore?: boolean
  isLoading?: boolean
  onNext?: () => void
  inverse?: boolean
  triggerProps?: ComponentPropsWithoutRef<'div'>
}

export const InfiniteScroll = ({
  hasMore,
  isLoading,
  onNext,
  inverse,
  children,
  className,
  triggerProps,
  ...restProps
}: InfiniteScrollProps) => {
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const { className: triggerClassName, ...restTriggerProps } =
    triggerProps ?? {}

  useEffect(() => {
    if (!triggerRef.current || !hasMore || isLoading || !onNext) {
      return
    }

    const currentRef = triggerRef.current
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onNext()
      }
    })

    observer.observe(currentRef)

    return () => {
      observer.unobserve(currentRef)
    }
  }, [hasMore, isLoading, onNext])

  return (
    <div className={cn('relative', className)} {...restProps}>
      {children}

      {!isLoading && hasMore && (
        <div
          className={cn(
            'absolute size-10 right-8 opacity-0 pointer-events-none',
            inverse ? 'top-8' : 'bottom-8',
            triggerClassName
          )}
          ref={triggerRef}
          {...restTriggerProps}
        />
      )}
    </div>
  )
}
