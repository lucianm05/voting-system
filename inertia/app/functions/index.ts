import dayjs from 'dayjs'
import { DATETIME_FORMAT, TIMEZONE } from '~/app/constants'

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
