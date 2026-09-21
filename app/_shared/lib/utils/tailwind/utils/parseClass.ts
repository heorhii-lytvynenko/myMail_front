import { type ClassValue } from 'clsx'
import { BREAKPOINTS, type BreakpointType } from '../../../const'
import { cn } from '../../cn'

export function parseClass(
  className: ClassValue
): Partial<Record<BreakpointType, string>>

export function parseClass<T>(
  className: ClassValue,
  options: { transform: (value: string) => T }
): Partial<Record<BreakpointType, T>>

export function parseClass<T>(
  className: ClassValue,
  options?: { transform?: (value: string) => T }
): Partial<Record<BreakpointType, T | string>> {
  return cn(className)
    .split(' ')
    .reduce(
      (acc, cls) => {
        const [prefix, value] = cls.includes(':')
          ? cls.split(':')
          : ['default', cls]

        if (prefix in BREAKPOINTS) {
          acc[prefix as BreakpointType] = options?.transform
            ? options.transform(value)
            : value
        }

        return acc
      },
      {} as Partial<Record<BreakpointType, T | string>>
    )
}
