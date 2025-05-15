import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/dropzone/styles.css'
import '@mantine/notifications/styles.css'
import '../../../css/app.css'

import { createTheme, MantineProvider as MProvider } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { PropsWithChildren } from 'react'
import { LOCALE } from '~/app/shared/constants'

const theme = createTheme({
  spacing: {
    xl: '1.5rem',
    xxl: '2rem',
  },
  fontFamily: 'Instrument Sans',
})

export function MantineProvider({ children }: PropsWithChildren) {
  return (
    <MProvider theme={theme}>
      <ModalsProvider>
        <DatesProvider settings={{ consistentWeeks: true, locale: LOCALE }}>
          <Notifications position="top-right" />

          {children}
        </DatesProvider>
      </ModalsProvider>
    </MProvider>
  )
}
