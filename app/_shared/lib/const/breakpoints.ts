export const BREAKPOINTS = {
  default: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const
export type BreakpointType = keyof typeof BREAKPOINTS

export const BREAKPOINT_KYES = Object.keys(BREAKPOINTS) as BreakpointType[]
