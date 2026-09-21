import dayjs from 'dayjs'
import { DATE_PERIODS } from '@shared/lib/const'
import { getDateFromByPeriod } from '@shared/lib/utils/getDateFromByPeriod'
import { getDateToByPeriod } from '@shared/lib/utils/getDateToByPeriod'

interface Options {
  type: 'from' | 'to'
}

export const parseQueryDate = (
  value: string | null | undefined,
  { type }: Options
): string | undefined => {
  if (!value) return

  const period = DATE_PERIODS.find((date) => date.id === value)

  if (period) {
    if (type === 'from') return getDateFromByPeriod(value)
    if (type === 'to') return getDateToByPeriod(value)
  }

  const d = dayjs(value)

  if (!d.isValid()) return

  if (type === 'from') return d.startOf('day').toISOString()
  if (type === 'to') return d.endOf('day').toISOString()

  return d.toISOString()
}
