import type { ComponentProps } from 'react'
import { cn } from '@shared/lib/utils'

export type PageProps = ComponentProps<'div'>

export const Page = ({ className, ...restProps }: PageProps) => {
  return <div className={cn('flex flex-col grow', className)} {...restProps} />
}

export type PageContentProps = ComponentProps<'div'>

const Content = ({ className, ...restProps }: PageContentProps) => {
  return (
    <div
      className={cn('flex flex-col grow pt-4 pb-8 gap-8', className)}
      {...restProps}
    />
  )
}

Page.Content = Content
