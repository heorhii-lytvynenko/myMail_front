import { useEffect, useRef } from 'react'

export const useDebounce = (
  callback: () => void,
  deps: any[],
  delay: number = 500
) => {
  const handlerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (handlerRef.current) {
      clearTimeout(handlerRef.current)
    }

    handlerRef.current = setTimeout(() => {
      callback()
    }, delay)

    return () => {
      if (handlerRef.current) {
        clearTimeout(handlerRef.current)
      }
    }
  }, [...deps, delay])
}
