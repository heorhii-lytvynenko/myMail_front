import type { IconType } from '@shared/lib/const'
import { cn } from '@shared/lib/utils'
import type { ButtonElementType, ButtonProps } from '@shared/ui/Button'
import { Button } from '@shared/ui/Button'

type ActionProps<T extends ButtonElementType | React.ComponentType<any>> = Omit<
  ButtonProps,
  'iconLeft' | 'iconRight' | 'loading' | 'type' | 'spinnerProps'
> & {
  icon?: IconType
} & React.ComponentPropsWithoutRef<T>

export const Action = <
  T extends ButtonElementType | React.ComponentType<any> = 'button'
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
