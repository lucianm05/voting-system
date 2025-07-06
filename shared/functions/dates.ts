import { DayjsCompatibleDate } from '#shared/types/index'
import dayjs from 'dayjs'

export function getAge(birthDate: Date) {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

export function toUTC(date: DayjsCompatibleDate | undefined) {
  return dayjs(date, { utc: true })
}

export function isPresent(dateStart: DayjsCompatibleDate, dateEnd: DayjsCompatibleDate) {
  return isPast(dateStart) && isFuture(dateEnd)
}

export function isFuture(date: DayjsCompatibleDate) {
  const currentDate = toUTC(undefined)
  const comparedDate = toUTC(date)

  return currentDate.isBefore(comparedDate, 'millisecond')
}

export function isPast(date: DayjsCompatibleDate) {
  const currentDate = toUTC(undefined)
  const comparedDate = toUTC(date)

  return currentDate.isAfter(comparedDate, 'millisecond')
}
