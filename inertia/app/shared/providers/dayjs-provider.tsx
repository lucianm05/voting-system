import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/ro'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { PropsWithChildren } from 'react'
import { LOCALE } from '~/app/shared/constants'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.extend(duration)

dayjs.locale(LOCALE)

export function DayjsProvider({ children }: PropsWithChildren) {
  return children
}
