import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { ElementType } from 'react'
import { cn } from '@shared/lib/utils'

const chipVariants = cva(
  `
    inline-flex items-center justify-center rounded-md border w-fit
    whitespace-nowrap shrink-0 border-transparent gap-1
    [&>svg]:size-3 [&>svg]:pointer-events-none
    overflow-hidden
  `,
  {
    variants: {
      size: {
        m: 'text-xs font-medium h-6 px-2 py-0.5',
        l: 'text-sm font-medium h-7 px-3 py-0.5'
      },
      variant: {
        filled: '',
        outlined: ''
      },
      color: {
        slate: '',
        blue: '',
        green: ''
      }
    },

    compoundVariants: [
      {
        variant: 'outlined',
        color: 'slate',
        class: 'bg-slate-100 text-slate-700'
      },
      {
        variant: 'outlined',
        color: 'blue',
        class: 'bg-blue-50 text-blue-800'
      },
      {
        variant: 'outlined',
        color: 'green',
        class: 'bg-green-100/90 text-emerald-700'
      },
      {
        variant: 'filled',
        color: 'blue',
        class: `
          bg-blue-600/90 text-white border-white/20 shadow-sm backdrop-blur-sm
        `
      },
      {
        variant: 'filled',
        color: 'green',
        class: `
          bg-green-600/90 text-white border-white/20 shadow-sm backdrop-blur-sm
        `
      },
      {
        variant: 'filled',
        color: 'slate',
        class: 'bg-slate-900 text-slate-100'
      }
    ],

    defaultVariants: {
      size: 'm',
      variant: 'outlined',
      color: 'slate'
    }
  }
)

type AdditionalChipPropsType<T extends ElementType> =
  T extends keyof React.JSX.IntrinsicElements
    ? React.JSX.IntrinsicElements[T]
    : React.ComponentPropsWithoutRef<T>
export type ChipProps = VariantProps<typeof chipVariants>
type Props<T extends ElementType> = {
  as?: T
} & ChipProps &
  AdditionalChipPropsType<T>
export type ChipColor = NonNullable<VariantProps<typeof chipVariants>['color']>

export const Chip = <T extends ElementType = 'span'>({
  as,
  className,
  size,
  variant,
  color,
  ...props
}: Props<T>) => {
  const Component = as || 'span'

  return (
    <Component
      className={cn(chipVariants({ size, variant, color }), className)}
      {...props}
    />
  )
}
