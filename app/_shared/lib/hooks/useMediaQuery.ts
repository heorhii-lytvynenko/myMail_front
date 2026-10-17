import { useEffect, useMemo, useState } from 'react'
import type { BreakpointType } from '../const'
import { BREAKPOINT_KYES, BREAKPOINTS } from '../const'

export type MediaQueryState = {
  [K in `is${Capitalize<BreakpointType>}`]: boolean | undefined
}

export const useMediaQuery = (): MediaQueryState => {
  const [state, setState] = useState<MediaQueryState>(() =>
    BREAKPOINT_KYES.reduce((acc, key) => {
      acc[
        `is${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof MediaQueryState
      ] = undefined

      return acc
    }, {} as MediaQueryState)
  )

  useEffect(() => {
    const calculateState = () => {
      const width = window.innerWidth

      const next = BREAKPOINT_KYES.reduce((acc, key) => {
        acc[
          `is${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof MediaQueryState
        ] = width >= BREAKPOINTS[key as BreakpointType]

        return acc
      }, {} as MediaQueryState)

      setState(next)
    }

    calculateState()

    window.addEventListener('resize', calculateState)

    return () => window.removeEventListener('resize', calculateState)
  }, [])

  return state
}

export const useMediaMatch = <T>(
  breakpoints: Partial<Record<BreakpointType, T>>
): T | undefined => {
  const state = useMediaQuery()

  const breakpointsKey = BREAKPOINT_KYES.filter((key) => key in breakpoints)
    .map((key) => `${key}:${String(breakpoints[key as BreakpointType])}`)
    .join('|')

  const match = useMemo(() => {
    const sorted = BREAKPOINT_KYES.filter((key) => key in breakpoints).sort(
      (a, b) =>
        BREAKPOINTS[b as BreakpointType] - BREAKPOINTS[a as BreakpointType]
    )

    const matched = sorted.find(
      (key) =>
        state[
          `is${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof MediaQueryState
        ]
    )

    return matched ? breakpoints[matched as BreakpointType] : undefined
  }, [state, breakpointsKey])

  return match
}
