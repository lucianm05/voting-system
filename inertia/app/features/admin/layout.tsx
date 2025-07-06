import { Routes } from '#shared/constants/routes'
import { usePage } from '@inertiajs/react'
import { AppShell } from '@mantine/core'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminLogoutForm } from '~/app/features/admin/logout'
import { Users, Vote } from '~/app/shared/components/icons'
import { Link } from '~/app/shared/components/ui/link'
import { LogoWithTitle } from '~/app/shared/components/ui/logo'

export function AdminLayout({ children }: PropsWithChildren) {
  const { t } = useTranslation()
  const route = usePage()

  return (
    <AppShell
      padding="md"
      header={{ height: 72 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
      }}
    >
      <AppShell.Header className="flex items-center space-x-3 px-4">
        <LogoWithTitle />
      </AppShell.Header>

      <AppShell.Navbar p="md" className="flex flex-col justify-between">
        <div>
          <Link
            href={Routes.admin.elections.index.absolutePath}
            label={t('common.elections')}
            leftSection={<Vote />}
            active={route.url.includes(Routes.admin.elections.index.relativePath)}
            className="font-medium"
          />
          <Link
            href={Routes.admin.candidates.index.absolutePath}
            label={t('common.candidates')}
            leftSection={<Users />}
            active={route.url.includes(Routes.admin.candidates.index.relativePath)}
            className="font-medium"
          />
        </div>

        <AdminLogoutForm className="w-full" />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
