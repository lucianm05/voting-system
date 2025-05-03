import { ROUTES } from '#shared/constants/routes'
import { usePage } from '@inertiajs/react'
import { AppShell } from '@mantine/core'
import { Users, Vote } from 'lucide-react'
import { PropsWithChildren } from 'react'
import { Link } from '~/app/components/ui/link'
import { AdminLogoutForm } from '~/app/features/admin/logout'

export function AdminLayout({ children }: PropsWithChildren) {
  const route = usePage()

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
          <Link
            href={ROUTES.admin.elections.index.absolutePath}
            label="Elections"
            leftSection={<Vote size={20} />}
            active={route.url.includes(ROUTES.admin.elections.index.relativePath)}
          />
          <Link
            href={ROUTES.admin.candidates.index.absolutePath}
            label="Candidates"
            leftSection={<Users size={20} />}
            active={route.url.includes(ROUTES.admin.candidates.index.relativePath)}
          />
        </div>

        <AdminLogoutForm className="w-full" />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
