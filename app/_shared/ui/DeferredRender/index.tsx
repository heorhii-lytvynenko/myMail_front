import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

export interface DeferredRenderProps {
  delay?: number
  fallback?: ReactNode
  children: ReactNode
}

export const DeferredRender = ({
  delay = 200,
  children,
  fallback = null
}: DeferredRenderProps) => {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (!isReady) {
    return fallback
  }

  return children
}
