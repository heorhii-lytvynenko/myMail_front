import { routing } from '@shared/i18n/routing'
import { dj } from '@shared/lib/utils/dayjs'

interface NormalizeDateParams {
  startDate: string | null | undefined
  endDate?: string | null
  locale?: string
}

const toValidDate = (value: string | null | undefined) => {
  if (!value) return null

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

export const toNormalizeDate = ({
  startDate,
  endDate,
  locale = routing.defaultLocale
}: NormalizeDateParams): string => {
  if (!startDate) return ''
  const start = dj(startDate).locale(locale)

  if (!start.isValid()) return ''

  const currentYear = dj().year()
  const startYear = start.year()

  const startDateFormat = startYear === currentYear ? 'D MMM' : 'D MMM YYYY'
  const datePart = start.format(startDateFormat)
  const startTime = start.format('HH:mm')

  const end = dj(endDate).locale(locale)

  if (!endDate || !end.isValid()) {
    return `${datePart}, ${startTime}`
  }

  const isSameDay = start.isSame(end, 'day')

  if (isSameDay) {
    return `${datePart}, ${startTime} - ${end.format('HH:mm')}`
  }

  const endYear = end.year()
  const endDateFormat = endYear === currentYear ? 'D MMM' : 'D MMM YYYY'

  const endDatePart = end.format(endDateFormat)
  const endTime = end.format('HH:mm')

  return `${datePart}, ${startTime} - ${endDatePart}, ${endTime}`
}

export const formatLocalizedTimeRange = ({
  startDate,
  endDate,
  timezone,
  fallback,
  locale = routing.defaultLocale
}: {
  startDate: string | null | undefined
  endDate: string | null | undefined
  timezone: string | null | undefined
  fallback: string
  locale?: string
}) => {
  const start = toValidDate(startDate)

  if (!start) {
    return fallback
  }

  const formatTime = (date: Date) => {
    const format = (timeZone?: string | null) => {
      try {
        return new Intl.DateTimeFormat(locale, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          ...(timeZone ? { timeZone } : {})
        }).format(date)
      } catch {
        return ''
      }
    }

    if (timezone) {
      const timeWithTimezone = format(timezone)

      if (timeWithTimezone) {
        return timeWithTimezone
      }
    }

    return format()
  }

  const startTime = formatTime(start)
  const end = toValidDate(endDate)
  const endTime = end ? formatTime(end) : ''

  if (!startTime) {
    return fallback
  }

  const timeRange = endTime ? `${startTime} - ${endTime}` : startTime

  if (!timezone) {
    return timeRange
  }

  try {
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'shortOffset'
    }).formatToParts(start)

    const timezoneOffset = parts.find(
      (part) => part.type === 'timeZoneName'
    )?.value

    if (!timezoneOffset) {
      return timeRange
    }

    return `${timeRange} (${timezoneOffset.replace('UTC', 'GMT')})`
  } catch {
    return timeRange
  }
}

export const formatPublishedAt = ({
  publishedAt,
  locale
}: {
  publishedAt: string
  locale: string
}) => {
  dj.locale(locale)

  return dj(publishedAt).fromNow()
}
