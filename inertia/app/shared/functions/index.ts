import dayjs from 'dayjs'
import { DATETIME_FORMAT, TIMEZONE } from '~/app/shared/constants'

export function toLocalTimezone(date: Date | string) {
  return dayjs(date).tz(TIMEZONE)
}

export function formatDate(date: Date | string) {
  const dayjsDate = toLocalTimezone(date)

  if (!dayjsDate.isValid()) {
    return '-'
  }

  return dayjsDate.format(DATETIME_FORMAT)
}

export function cn(...classes: unknown[]) {
  return classes.filter((c) => Boolean(c) && typeof c === 'string').join(' ')
}
