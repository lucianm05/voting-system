import { AppShell } from '@mantine/core'
import { PropsWithChildren } from 'react'

export function AdminLayout({ children }: PropsWithChildren) {
  return (
    <AppShell>
      <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
