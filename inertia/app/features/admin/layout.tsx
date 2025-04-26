import { AppShell } from '@mantine/core'
import { PropsWithChildren } from 'react'
import { Link } from '~/app/components/link'
import { AdminLogoutForm } from '~/app/features/admin/logout'

export function AdminLayout({ children }: PropsWithChildren) {
  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
      }}
    >
      <AppShell.Header></AppShell.Header>
      <AppShell.Navbar p="md" className="flex flex-col justify-between">
        <div>
          <Link href="/admin/elections" label="Elections" />
          <Link href="/admin/elections" label="Candidates" />
        </div>

        <AdminLogoutForm className="w-full" />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
