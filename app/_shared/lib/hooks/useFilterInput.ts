import { useCallback, useEffect, useState } from 'react'
import { useDebounce, useIsTouch, useSearchParams } from '@shared/lib/hooks'

interface UseFilterInputOptions {
  name?: string
  debounceDelay?: number
  normalize?: (value: string) => string
  updateParamForTouch?: boolean
}

export const useFilterInput = ({
  name,
  debounceDelay,
  normalize = (v) => v,
  updateParamForTouch
}: UseFilterInputOptions) => {
  const { getSearchParam, setSearchParam } = useSearchParams()
  const isTouch = useIsTouch()
  const paramValue = name ? (getSearchParam(name) ?? '') : ''
  const [value, setValue] = useState(() => normalize(paramValue))

  useEffect(() => {
    const next = normalize(paramValue)

    if (next !== value) {
      setValue(next)
    }
  }, [paramValue])

  useDebounce(
    () => {
      if (!name || (isTouch && !updateParamForTouch)) return

      const prevValue = getSearchParam(name) ?? ''

      if (prevValue !== value) {
        setSearchParam(name, value)
      }
    },
    [name, value, updateParamForTouch],
    debounceDelay
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!name || !isTouch) return

      if (e.key !== 'Enter') {
        return
      }

      const prevValue = getSearchParam(name) ?? ''

      if (prevValue !== value) {
        setSearchParam(name, value)
      }

      ;(e.target as HTMLInputElement).blur()
    },
    [name, value, isTouch, getSearchParam, setSearchParam]
  )

  const handleBlur = useCallback(() => {
    if (!name || !isTouch) return

    const prevValue = getSearchParam(name) ?? ''

    if (prevValue !== value) {
      setSearchParam(name, value)
    }
  }, [name, value, isTouch, getSearchParam, setSearchParam])

  return { value, setValue, handleBlur, handleKeyDown }
}
