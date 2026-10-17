import type { BreakpointType } from '@shared/lib/const'
import { BREAKPOINT_KYES } from '@shared/lib/const'
import { type MediaQueryState } from '@shared/lib/hooks'

export const isVisible = ({
  media,
  from,
  to
}: {
  media: MediaQueryState
  from?: BreakpointType | null
  to?: BreakpointType | null
}) => {
  if (Object.values(media).some((v) => v === undefined)) {
    return true
  }

  let activeIndex = -1

  for (let i = BREAKPOINT_KYES.length - 1; i >= 0; i--) {
    const bp = BREAKPOINT_KYES[i]
    const mediaKey =
      `is${bp.charAt(0).toUpperCase() + bp.slice(1)}` as keyof typeof media

    if (media[mediaKey]) {
      activeIndex = i
      break
    }
  }

  const isBelowSm = activeIndex === -1
  const fromIndex = from ? BREAKPOINT_KYES.indexOf(from) : 0
  const toIndex = to ? BREAKPOINT_KYES.indexOf(to) : BREAKPOINT_KYES.length

  if (isBelowSm) {
    return from === undefined || from === null
  }

  return activeIndex >= fromIndex && activeIndex < toIndex
}
