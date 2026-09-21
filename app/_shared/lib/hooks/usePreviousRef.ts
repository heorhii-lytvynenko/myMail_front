import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

export const usePreviousRef = <T>(value: T): RefObject<T | null> => {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    return () => {
      ref.current = value
    }
  }, [value])

  return ref
}
