import type { BreakpointType } from '@shared/lib/const'

interface Options {
  from?: BreakpointType | null
  to?: BreakpointType | null
}

export const getClasses = ({ from, to }: Options) => {
  const classes: string[] = []

  classes.push('hidden')

  if (!from) {
    classes.push('flex')
  } else {
    classes.push(`${from}:flex`)
  }

  if (to) {
    classes.push(`${to}:hidden`)
  }

  return classes
}
