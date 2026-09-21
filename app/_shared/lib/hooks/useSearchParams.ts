import { useSearchParams as useOriginalSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { useProgressRouter } from '@shared/i18n/navigation'

type ParamValue =
  | number
  | number[]
  | string
  | string[]
  | readonly string[]
  | null
  | undefined

interface GetSearchParamOptios {
  format?: 'string' | 'number' | 'array'
}

const normalizeParamValue = (value: ParamValue): string | null => {
  if (!value) return null

  const arr = Array.isArray(value) ? value : [value]

  if (!arr.length) return null

  return arr.join(',')
}

export const useSearchParams = () => {
  const router = useProgressRouter()
  const searchParams = useOriginalSearchParams()

  const setSearchParam = useCallback(
    (key: string, value: ParamValue) => {
      const params = new URLSearchParams(searchParams.toString())

      const nextValue = normalizeParamValue(value)
      const currentValue = params.get(key)

      if (currentValue === nextValue) {
        return
      }

      if (!nextValue) {
        params.delete(key)
      } else {
        params.set(key, nextValue)
      }

      router.replace(`?${params.toString()}`)
    },
    [searchParams, router]
  )

  const updateSearchParams = useCallback(
    (updates: Record<string, ParamValue>) => {
      const currentParams = new URLSearchParams(searchParams.toString())
      const nextParams = currentParams

      let hasChanges = false

      Object.entries(updates).forEach(([key, value]) => {
        const nextValue = normalizeParamValue(value)
        const currentValue = currentParams.get(key)

        if (currentValue === nextValue) {
          return
        }

        hasChanges = true

        if (!nextValue) {
          nextParams.delete(key)
        } else {
          nextParams.set(key, nextValue)
        }
      })

      if (!hasChanges) {
        return
      }

      router.replace(`?${nextParams.toString()}`)
    },
    [searchParams, router]
  )

  const getSearchParam = useCallback(
    <T = string>(
      key: string | null | undefined,
      options?: GetSearchParamOptios
    ): T | null => {
      if (!key) return null

      const raw = searchParams.get(key)

      if (!raw) return null

      const { format = 'string' } = options ?? {}

      switch (format) {
        case 'number': {
          const num = Number(raw)

          return Number.isNaN(num) ? null : (num as T)
        }

        case 'array':
          return raw.split(',').map((v) => v.trim()) as T

        case 'string':
        default:
          return raw as T
      }
    },
    [searchParams]
  )

  return { searchParams, getSearchParam, setSearchParam, updateSearchParams }
}
