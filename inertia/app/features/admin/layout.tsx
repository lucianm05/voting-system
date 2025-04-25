import { AppShell, MantineProvider } from '@mantine/core'
import { PropsWithChildren } from 'react'
import { Link } from '~/app/components/link'

export function AdminLayout({ children }: PropsWithChildren) {
  return (
    <MantineProvider>
      <AppShell
        padding="md"
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
        }}
      >
        <AppShell.Header></AppShell.Header>
        <AppShell.Navbar p="md">
          <Link href="/admin/elections" label="Elections" />
          <Link href="/admin/elections" label="Candidates" />
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </MantineProvider>
  )
}
