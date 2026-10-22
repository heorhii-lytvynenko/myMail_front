import type { IconType } from '@shared/lib/const'
import { cn } from '@shared/lib/utils'
import type { ButtonProps } from '@shared/ui/Button'
import { Button } from '@shared/ui/Button'

type ActionProps<T extends React.ElementType> = Omit<
  ButtonProps,
  'iconLeft' | 'iconRight' | 'loading' | 'type' | 'spinnerProps'
> & {
  icon?: IconType
} & React.ComponentPropsWithoutRef<T>

export const Action = <
  T extends React.ElementType = 'button'
>({
  as,
  className,
  variant = 'ghost',
  icon,
  size = 'icon-s',
  ...props
}: ActionProps<T>) => {
  return (
    <Button
      as={as}
      variant={variant}
      size={size}
      type='button'
      className={cn('text-slate-400', className)}
      iconLeft={icon}
      {...props}
    />
  )
}
