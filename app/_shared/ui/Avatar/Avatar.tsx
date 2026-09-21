import type { ImageProps } from 'next/image'
import Image from 'next/image'
import { type ComponentProps } from 'react'
import { cn } from '@shared/lib/utils'

type Props<T extends React.ElementType = 'div'> = ComponentProps<T> & {
  as?: T
  fallback: string | null | undefined
  src?: string
  lettersCount?: number
  slotProps?: {
    fallback?: ComponentProps<'span'>
    image?: Omit<Partial<ImageProps>, 'src'>
  }
}

export const Avatar = <T extends React.ElementType = 'div'>({
  as: Component = 'div',
  src,
  fallback,
  className,
  lettersCount = 1,
  slotProps,
  ...rest
}: Props<T>) => {
  const safeFallback = fallback ?? ''
  const { fallback: fallbackProps, image: imageProps } = slotProps ?? {}
  const { className: fallbackClassName, ...restFallbackProps } =
    fallbackProps ?? {}
  const { className: imageClassName, ...restImageProps } = imageProps ?? {}

  return (
    <Component
      className={cn(
        'relative flex size-10 shrink-0 rounded-full overflow-hidden',
        className
      )}
      {...rest}
    >
      {src ? (
        <Image
          fill
          src={src}
          alt={safeFallback}
          sizes='40px'
          className={cn(
            'object-cover object-center select-none',
            imageClassName
          )}
          draggable={false}
          {...restImageProps}
        />
      ) : (
        <span
          className={cn(
            `
              absolute bg-blue-700 inset-0 flex items-center justify-center
              text-center text-white font-bold select-none
            `,
            fallbackClassName
          )}
          {...restFallbackProps}
        >
          {safeFallback.slice(0, lettersCount).toUpperCase()}
        </span>
      )}
    </Component>
  )
}
