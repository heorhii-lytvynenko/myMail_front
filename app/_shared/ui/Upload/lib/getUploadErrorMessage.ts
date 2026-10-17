import type { useTranslations } from 'next-intl'
import type { ErrorCode } from 'react-dropzone'
import { formatBytes } from '@shared/lib/utils'

type GetUploadErrorMessageParams = {
  t: ReturnType<typeof useTranslations>
  code: ErrorCode | string
  maxSize: number
  minSize: number
  maxFiles: number
  accept: string
  fallback: string
}

export const getUploadErrorMessage = ({
  t,
  code,
  maxSize,
  minSize,
  maxFiles,
  accept,
  fallback
}: GetUploadErrorMessageParams): string => {
  switch (code) {
    case 'file-invalid-type':
      return t('validation.invalidType', { accept })

    case 'file-too-large':
      return t('validation.tooLarge', { maxSize: formatBytes(maxSize) })

    case 'file-too-small':
      return t('validation.tooSmall', { minSize: formatBytes(minSize) })

    case 'too-many-files':
      return t('validation.tooManyFiles', { maxFiles })

    default:
      return fallback
  }
}
