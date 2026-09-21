'use client'
import type { ComponentProps } from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'
import { cn } from '@shared/lib/utils'
import { Button } from '../Button'

export type DrawerProps = ComponentProps<typeof DrawerPrimitive.Root>

export const Drawer = ({ ...props }: DrawerProps) => {
  return (
    <DrawerPrimitive.Root
      data-slot='drawer'
      repositionInputs={false}
      {...props}
    />
  )
}

export type DrawerTriggerProps = ComponentProps<typeof DrawerPrimitive.Trigger>

const DrawerTrigger = ({ ...props }: DrawerTriggerProps) => {
  return <DrawerPrimitive.Trigger data-slot='drawer-trigger' {...props} />
}

Drawer.Trigger = DrawerTrigger

export type DrawerPortalProps = ComponentProps<typeof DrawerPrimitive.Portal>

const DrawerPortal = ({ ...props }: DrawerPortalProps) => {
  return <DrawerPrimitive.Portal data-slot='drawer-portal' {...props} />
}

Drawer.Portal = DrawerPortal

export type DrawerCloseProps = ComponentProps<typeof DrawerPrimitive.Close>

const DrawerClose = ({ ...props }: DrawerCloseProps) => {
  return <DrawerPrimitive.Close data-slot='drawer-close' {...props} />
}

Drawer.Close = DrawerClose

export type DrawerOverlayProps = ComponentProps<typeof DrawerPrimitive.Overlay>

const DrawerOverlay = ({ className, ...props }: DrawerOverlayProps) => {
  return (
    <DrawerPrimitive.Overlay
      data-slot='drawer-overlay'
      className={cn(
        `
          data-open:animate-in
          data-closed:animate-out data-closed:fade-out-0
          data-open:fade-in-0
          bg-black/40
          supports-backdrop-filter:backdrop-blur-xs
          fixed inset-0 z-50 will-change-[transform,opacity]
        `,
        className
      )}
      {...props}
    />
  )
}

Drawer.Overlay = DrawerOverlay

export type DrawerContentProps = ComponentProps<typeof DrawerPrimitive.Content>

const DrawerContent = ({
  className,
  children,
  onCloseAutoFocus,
  ...props
}: DrawerContentProps) => {
  return (
    <DrawerPortal data-slot='drawer-portal'>
      <DrawerOverlay />

      <DrawerPrimitive.Content
        data-slot='drawer-content'
        className={cn(
          `
            bg-white flex h-auto flex-col text-sm group/drawer-content fixed
            z-50
            after:will-change-[transform,opacity]
          `,
          `
            data-[vaul-drawer-direction=bottom]:inset-x-0
            data-[vaul-drawer-direction=bottom]:bottom-0
            data-[vaul-drawer-direction=bottom]:mt-24
            data-[vaul-drawer-direction=bottom]:max-h-[90dvh]
            data-[vaul-drawer-direction=bottom]:rounded-t-xl
            data-[vaul-drawer-direction=bottom]:border-t
          `,
          `
            data-[vaul-drawer-direction=left]:inset-y-0
            data-[vaul-drawer-direction=left]:left-0
            data-[vaul-drawer-direction=left]:w-[90dvw]
            data-[vaul-drawer-direction=left]:border-r
            data-[vaul-drawer-direction=left]:sm:max-w-sm
          `,
          `
            data-[vaul-drawer-direction=right]:inset-y-0
            data-[vaul-drawer-direction=right]:right-0
            data-[vaul-drawer-direction=right]:w-[90dvw]
            data-[vaul-drawer-direction=right]:border-l
            data-[vaul-drawer-direction=right]:sm:max-w-sm
          `,
          `
            data-[vaul-drawer-direction=top]:inset-x-0
            data-[vaul-drawer-direction=top]:top-0
            data-[vaul-drawer-direction=top]:mb-24
            data-[vaul-drawer-direction=top]:max-h-[90dvh]
            data-[vaul-drawer-direction=top]:rounded-b-2xl
            data-[vaul-drawer-direction=top]:border-b
          `,
          className
        )}
        onCloseAutoFocus={(event) => {
          if (onCloseAutoFocus) {
            return onCloseAutoFocus(event)
          } else {
            event.preventDefault()
          }
        }}
        {...props}
      >
        <div
          className={`
            py-4 w-full hidden
            group-data-[vaul-drawer-direction=bottom]/drawer-content:block
          `}
        >
          <div
            className={`
              bg-slate-200 h-1 w-[100px] rounded-full mx-auto shrink-0
            `}
          />
        </div>

        <DrawerClose asChild>
          <Button
            size='icon-m'
            variant='ghost'
            iconLeft='x'
            className={`
              absolute top-1 z-[1]
              group-data-[vaul-drawer-direction=left]/drawer-content:right-1
              group-data-[vaul-drawer-direction=right]/drawer-content:left-1
              group-data-[vaul-drawer-direction=top]/drawer-content:hidden
              group-data-[vaul-drawer-direction=bottom]/drawer-content:hidden
            `}
          />
        </DrawerClose>

        <div className='flex flex-col grow overflow-auto scrollbar-blackAlpha10'>
          {children}
        </div>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

Drawer.Content = DrawerContent

export type DrawerHeaderProps = ComponentProps<'div'>

const DrawerHeader = ({ className, ...props }: DrawerHeaderProps) => {
  return (
    <div
      data-slot='drawer-header'
      className={cn(
        `
          p-4 flex flex-col
          group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center
          group-data-[vaul-drawer-direction=top]/drawer-content:text-center
          group-data-[vaul-drawer-direction=left]/drawer-content:border-b
          group-data-[vaul-drawer-direction=left]/drawer-content:border-slate-100
        `,
        className
      )}
      {...props}
    />
  )
}

Drawer.Header = DrawerHeader

export type DrawerTitleProps = ComponentProps<typeof DrawerPrimitive.Title>

const DrawerTitle = ({ className, ...props }: DrawerTitleProps) => {
  return (
    <DrawerPrimitive.Title
      data-slot='drawer-title'
      className={cn('text-xl', className)}
      {...props}
    />
  )
}

Drawer.Title = DrawerTitle

export type DrawerDescriptionProps = ComponentProps<
  typeof DrawerPrimitive.Description
>

const DrawerDescription = ({ className, ...props }: DrawerBodyProps) => {
  return (
    <DrawerPrimitive.Description
      data-slot='drawer-description'
      className={cn('text-sm text-slate-500', className)}
      {...props}
    />
  )
}

Drawer.Description = DrawerDescription

export type DrawerBodyProps = ComponentProps<'div'>

const DrawerBody = ({ className, ...props }: DrawerBodyProps) => {
  return (
    <div
      data-slot='drawer-body'
      className={cn(
        'gap-4 p-4 flex flex-col grow overflow-auto scrollbar-blackAlpha10',
        className
      )}
      {...props}
    />
  )
}

Drawer.Body = DrawerBody

export type DrawerFooterProps = ComponentProps<'div'>

const DrawerFooter = ({ className, ...props }: DrawerFooterProps) => {
  return (
    <div
      data-slot='drawer-footer'
      className={cn(
        'gap-4 p-4 mt-auto flex flex-col border-t border-slate-100',
        className
      )}
      {...props}
    />
  )
}

Drawer.Footer = DrawerFooter
