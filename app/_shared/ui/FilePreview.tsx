'use client'
import type { ImageProps } from 'next/image'
import Image from 'next/image'
import { useEffect, useMemo } from 'react'

interface FilePreviewProps extends Omit<ImageProps, 'src' | 'alt'> {
  file?: File
}

export const FilePreview = ({ file, ...rest }: FilePreviewProps) => {
  const previewUrl = useMemo(
    () => file instanceof File && URL.createObjectURL(file),
    [file]
  )

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  if (!previewUrl || !file) {
    return null
  }

  return <Image src={previewUrl} alt={file.name} {...rest} />
}
