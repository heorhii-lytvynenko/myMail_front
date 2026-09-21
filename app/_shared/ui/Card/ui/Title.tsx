import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@shared/lib/utils'

const titleVariants = cva('', {
  variants: {
    size: {
      lg: `
        text-lg
        max-md:text-sm max-md:font-bold
      `,
      sm: 'text-sm font-bold'
    }
  },
  defaultVariants: {
    size: 'lg'
  }
})

type CardTitleProps = ComponentProps<'h1'> & VariantProps<typeof titleVariants>

export const Title = ({
  className,
  size,
  children,
  ...rest
}: CardTitleProps) => {
  return (
    <h2 className={cn(titleVariants({ size }), className)} {...rest}>
      {children}
    </h2>
  )
}
