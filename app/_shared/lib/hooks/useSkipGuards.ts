'use client'
import { useEffect } from 'react'
import { useGuardStore } from '@shared/store'

export const useSkipGuards = () => {
  const setQuardsToSkip = useGuardStore((state) => state.setQuardsToSkip)

  useEffect(() => {
    return () => setQuardsToSkip([])
  }, [])

  return { setQuardsToSkip }
}
