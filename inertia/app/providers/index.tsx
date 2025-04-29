import { createTheme, MantineProvider } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { PropsWithChildren } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '~/i18n'

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
        <DatesProvider settings={{ consistentWeeks: true, locale: i18n.language }}>
          {children}
        </DatesProvider>
      </MantineProvider>
    </I18nextProvider>
  )
}
