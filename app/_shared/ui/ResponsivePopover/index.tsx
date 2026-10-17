import { useMediaQuery } from '@shared/lib/hooks'
import { cn } from '@shared/lib/utils'
import type { DrawerTitleProps } from '../Drawer'
import { Drawer } from '../Drawer'
import type {
  PopoverContentProps,
  PopoverProps,
  PopoverTriggerProps
} from '../Popover'
import { Popover } from '../Popover'

export type ResponsivePopoverProps = PopoverProps

export const ResponsivePopover = ({
  children,
  ...rest
}: ResponsivePopoverProps) => {
  return (
    <Popover {...rest}>
      <Drawer {...rest}>{children}</Drawer>
    </Popover>
  )
}

export type ResponsivePopoverTriggerProps = PopoverTriggerProps

const ResponsivePopoverTrigger = ({
  ...rest
}: ResponsivePopoverTriggerProps) => {
  const { isLg } = useMediaQuery()

  if (isLg) {
    return <Popover.Trigger {...rest} />
  }

  return <Drawer.Trigger {...rest} />
}

ResponsivePopover.Trigger = ResponsivePopoverTrigger

export type ResponsivePopoverContentProps = PopoverContentProps

const ResponsivePopoverContent = ({
  ...rest
}: ResponsivePopoverContentProps) => {
  const { isLg } = useMediaQuery()

  if (isLg) {
    return <Popover.Content {...rest} />
  }

  return <Drawer.Content {...rest} />
}

ResponsivePopover.Content = ResponsivePopoverContent

export type ResponsivePopoverTitleProps = DrawerTitleProps

const ResponsivePopoverTitle = ({
  className,
  ...rest
}: ResponsivePopoverTitleProps) => {
  return <Drawer.Title className={cn('sr-only', className)} {...rest} />
}

ResponsivePopover.Title = ResponsivePopoverTitle
