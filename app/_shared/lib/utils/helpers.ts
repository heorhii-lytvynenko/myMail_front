import { notFound } from 'next/navigation'
import type { ZodRawShape } from 'zod'
import z from 'zod'
import { routing } from '@shared/i18n/routing'
import type { PaginatedResponse } from '@shared/types'
import type { SelectOptionType, SelectValueType } from '@shared/ui/SelectPicker'
import { PLACEHOLDER_TEXT } from '../const'
import { isType } from './isType'

export const isClient = () => typeof window !== 'undefined'

export const parseNumber = (value: unknown, defaultValue = 0): number => {
  const num = Number(value)

  return isNaN(num) ? defaultValue : num
}

export const formatAmount = (
  value: number | undefined | null | string,
  options?: {
    fallback?: string
  }
) => {
  const { fallback = PLACEHOLDER_TEXT } = options ?? {}

  if (isType.nil(value)) {
    return fallback
  }

  const v = Number(value)

  if (!isType.number(v)) {
    return fallback
  }

  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0
  }).format(v)
}

export const formatLanguageList = ({
  languages,
  fallback = PLACEHOLDER_TEXT,
  locale = routing.defaultLocale
}: {
  languages: string[] | null | undefined
  fallback?: string
  locale?: string
}) => {
  if (!languages?.length) {
    return fallback
  }

  try {
    const displayNames = new Intl.DisplayNames([locale], { type: 'language' })

    return languages
      .map((language) => {
        const normalized = language.replace('_', '-')

        return displayNames.of(normalized) ?? normalized.toUpperCase()
      })
      .join(', ')
  } catch {
    return languages.map((language) => language.toUpperCase()).join(', ')
  }
}

export const getNextPageParam = ({ page }: PaginatedResponse<unknown>) => {
  if (page.pageNumber + 1 < page.totalPages) {
    return page.pageNumber + 1
  }

  return undefined
}

export const getPreviousPageParam = ({ page }: PaginatedResponse<unknown>) => {
  if (page.pageNumber >= 1) {
    return page.pageNumber - 1
  }

  return undefined
}

export const equalIds = (
  a: Array<string | number>,
  b: Array<string | number>
) => {
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; i++) {
    if (String(a[i]) !== String(b[i])) return false
  }

  return true
}

export const createParamSchema = <T extends ZodRawShape>(shape: T) => {
  const Schema = z.object(shape)
  const getKey = (key: keyof T) => key

  return {
    Schema,
    getKey
  } as const
}

export const defaultGetOptionLabel = (option: SelectOptionType) => {
  return option.displayName ?? ''
}

export const getOptionLabelById = <T extends SelectOptionType>(
  options: T[],
  id: string | number | null | undefined
) => {
  if (!id) return ''

  return options.find((option) => option.id === id)?.displayName ?? String(id)
}

export const isSameOption = (
  o1: SelectOptionType | null,
  o2: SelectOptionType | null
) => {
  if (!o1 || !o2) return false

  return String(o1.id) === String(o2.id)
}

export const notFoundOn404 = (error: unknown): never => {
  if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
    notFound()
  }

  throw error
}

export const isActiveOption = ({
  value,
  fixedValue,
  option
}: {
  value: SelectValueType<SelectOptionType, boolean>
  fixedValue: SelectValueType<SelectOptionType, boolean> | undefined
  option: SelectOptionType
}) => {
  const current = (Array.isArray(value) ? value : [value]).filter((v) => !!v)

  if (!current.length && fixedValue) {
    const fixed = (Array.isArray(fixedValue) ? fixedValue : [fixedValue]).filter(
      (v) => !!v
    )

    return fixed.some((v) => v.id === option.id)
  }

  return current.some((v) => v.id === option.id)
}

export const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
