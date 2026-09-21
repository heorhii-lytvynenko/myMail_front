import dayjs from 'dayjs'
import type { DatePeriodType } from '../const/dates'

const DATE_PERIODS_MAP: Record<DatePeriodType, dayjs.Dayjs> = {
  TODAY: dayjs().endOf('day'),
  TOMORROW: dayjs().add(1, 'day').endOf('day'),
  THIS_WEEK: dayjs().endOf('week'),
  NEXT_WEEK: dayjs().add(1, 'week').endOf('week'),
  THIS_MONTH: dayjs().endOf('month')
}

export const getDateToByPeriod = (period: string): string | undefined => {
  const date = DATE_PERIODS_MAP[period as DatePeriodType]

  return date ? date.toISOString() : undefined
}
