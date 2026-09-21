import 'dayjs/locale/en'
import 'dayjs/locale/uk'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { routing } from '@shared/i18n/routing'

dayjs.extend(relativeTime)

dayjs.locale(routing.defaultLocale)

export const dj = dayjs
