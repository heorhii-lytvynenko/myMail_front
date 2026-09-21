import { useTranslations } from 'next-intl'
import { type ReactNode } from 'react'
import type { Accept } from 'react-dropzone'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { cn } from '@shared/lib/utils'
import { DEFAULT_IMAGE_ACCEPT } from '../lib/const'
import { getUploadErrorMessage } from '../lib/getUploadErrorMessage'

export interface UploadZoneProps<TMultiple extends boolean = false> {
  onChange: (value: TMultiple extends true ? File[] : File | undefined) => void
  accept?: Accept
  multiple?: TMultiple
  minSize?: number
  maxSize?: number
  children?: ReactNode
  maxFiles?: TMultiple extends true ? number : 1
  className?: string
}

export const UploadZone = <TMultiple extends boolean = false>({
  onChange,
  accept = DEFAULT_IMAGE_ACCEPT,
  multiple = false as TMultiple,
  minSize = 0,
  maxFiles = 1,
  maxSize = 5_242_880,
  children,
  className
}: UploadZoneProps<TMultiple>) => {
  const t = useTranslations()
  const { getRootProps, getInputProps } = useDropzone({
    accept,
    maxFiles,
    minSize,
    maxSize,
    multiple,
    onDropRejected: (fileRejections) => {
      const lastRejection = fileRejections[fileRejections.length - 1]

      if (!lastRejection) {
        return
      }

      const lastError = lastRejection.errors[lastRejection.errors.length - 1]

      if (!lastError) {
        return
      }

      const message = getUploadErrorMessage({
        t,
        code: lastError.code,
        fallback: lastError.message,
        maxSize,
        minSize,
        maxFiles,
        accept: Object.keys(accept).join(', ')
      })

      toast.error(message)
    },
    onDropAccepted: (accepted) => {
      const nextValue = multiple ? accepted : accepted[0]

      onChange(nextValue as unknown as TMultiple extends true ? File[] : File)
    }
  })

  return (
    <div {...getRootProps()} className={cn('cursor-pointer', className)}>
      <input {...getInputProps()} />

      {children}
    </div>
  )
}
