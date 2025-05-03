import { createTheme, MantineProvider } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { PropsWithChildren } from 'react'
import { I18nextProvider } from 'react-i18next'
import { LOCALE } from '~/app/constants'
import i18n from '~/i18n'

import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import '../../css/app.css'

import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/ro'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.locale(LOCALE)

const theme = createTheme({
  spacing: {
    xl: '1.5rem',
    xxl: '2rem',
  },
  fontFamily: 'Instrument Sans',
})

export function Providers({ children }: PropsWithChildren) {
  return (
    <I18nextProvider i18n={i18n}>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <DatesProvider settings={{ consistentWeeks: true, locale: i18n.language }}>
            <Notifications position="top-right" />

            {children}
          </DatesProvider>
        </ModalsProvider>
      </MantineProvider>
    </I18nextProvider>
  )
}
