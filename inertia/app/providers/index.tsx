import { createTheme, MantineProvider } from '@mantine/core'
import { PropsWithChildren } from 'react'

const theme = createTheme({
  spacing: {
    xl: '1.5rem',
    xxl: '2rem',
  },
})

export function Providers({ children }: PropsWithChildren) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>
}
