import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/ro'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { PropsWithChildren } from 'react'
import { LOCALE } from '~/app/constants'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.locale(LOCALE)

export function DayjsProvider({ children }: PropsWithChildren) {
  return children
}
