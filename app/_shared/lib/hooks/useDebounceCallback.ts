import { useRef, useCallback, useEffect } from 'react'

export const useDebounceCallback = <T extends (...args: any[]) => void>(
  callback: T,
  delay = 300
) => {
  const timer = useRef<NodeJS.Timeout | null>(null)

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }
  }, [])

  return debounced
}
