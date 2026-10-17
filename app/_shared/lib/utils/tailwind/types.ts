import type { BreakpointType } from '@shared/lib/const'

type Responsive<T extends string> =
  | T
  | { [K in Exclude<BreakpointType, 'default'>]: `${K}:${T}` }[Exclude<
      BreakpointType,
      'default'
    >]

export type ResponsiveClass<T extends string> = Responsive<T> | Responsive<T>[]

export type GridColsClassName = ResponsiveClass<`grid-cols-${string}`>
