import { MantineProvider } from '@mantine/core'
import { PropsWithChildren } from 'react'

export function Providers({ children }: PropsWithChildren) {
  return <MantineProvider>{children}</MantineProvider>
}
