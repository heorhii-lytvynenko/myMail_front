import { useEffect } from 'react'

export const useDebounce = (callback: () => void, delay = 500) => {
  useEffect(() => {
    const timer = setTimeout(callback, delay)
    return () => clearTimeout(timer)
  }, [callback, delay])
}
