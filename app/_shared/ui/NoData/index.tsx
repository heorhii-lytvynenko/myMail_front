import type { ComponentProps, FC, ReactNode, SVGProps } from 'react'
import { cn } from '@shared/lib/utils'
import EmptyIcon from './assets/empty.svg?react'

export interface NoDataProps extends Omit<ComponentProps<'div'>, 'title'> {
  title?: ReactNode
  description?: ReactNode
  contentProps?: ComponentProps<'div'>
  imageProps?: SVGProps<SVGSVGElement>
  titleProps?: ComponentProps<'h1'>
}

export const NoData: FC<NoDataProps> = ({
  title = 'No Data',
  description,
  className,
  children,
  imageProps,
  contentProps,
  titleProps,
  ...divProps
}) => {
  const { className: contentClassName, ...restContentProps } =
    contentProps ?? {}
  const { className: titleClassName, ...restTitleProps } = titleProps ?? {}
  const {
    width = 72,
    height = 80,
    className: imageClassName,
    ...restImageProps
  } = imageProps ?? {}

  return (
    <section
      className={cn(
        'flex grow flex-col items-center justify-center p-6',
        className
      )}
      {...divProps}
    >
      <EmptyIcon
        className={cn(imageClassName)}
        width={width}
        height={height}
        {...restImageProps}
      />

      <div
        className={cn('flex flex-col gap-1 text-center', contentClassName)}
        {...restContentProps}
      >
        {title && (
          <h2 className={cn('text-xl', titleClassName)} {...restTitleProps}>
            {title}
          </h2>
        )}
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  )
}
