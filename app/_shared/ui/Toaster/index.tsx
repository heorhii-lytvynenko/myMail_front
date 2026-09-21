'use client'
import { Toaster as Sonner } from 'sonner'
import { cn } from '@shared/lib/utils'

type ToasterProps = React.ComponentProps<typeof Sonner>

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme='dark'
      className='toaster group'
      position='top-right'
      toastOptions={{
        classNames: {
          toast: cn(
            `
              toast group
              group-[.toaster]:rounded-lg group-[.toaster]:border
              group-[.toaster]:border-slate-200 group-[.toaster]:bg-white
              group-[.toaster]:p-4 group-[.toaster]:text-base
              group-[.toaster]:text-slate-900 group-[.toaster]:font-bold
            `
          )
        }
      }}
      {...props}
    />
  )
}
