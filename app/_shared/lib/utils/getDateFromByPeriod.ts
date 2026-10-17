import dayjs from 'dayjs'
import type { DatePeriodType } from '../const'

const DATE_PERIODS_MAP: Record<DatePeriodType, dayjs.Dayjs> = {
  TODAY: dayjs().startOf('day'),
  TOMORROW: dayjs().add(1, 'day').startOf('day'),
  THIS_WEEK: dayjs().startOf('week'),
  NEXT_WEEK: dayjs().add(1, 'week').startOf('week'),
  THIS_MONTH: dayjs().startOf('month')
}

export const getDateFromByPeriod = (period: string): string | undefined => {
  const date = DATE_PERIODS_MAP[period as DatePeriodType]

  return date ? date.toISOString() : undefined
}
