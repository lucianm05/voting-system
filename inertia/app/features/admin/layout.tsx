import { ROUTES } from '#shared/constants/routes'
import { usePage } from '@inertiajs/react'
import { AppShell, Text } from '@mantine/core'
import { Users, Vote } from 'lucide-react'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminLogoutForm } from '~/app/features/admin/logout'
import { Link } from '~/app/shared/ui/link'
import { Logo } from '~/app/shared/ui/logo'

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
        <Logo />
        <Text size="xl" fw={500}>
          {t('app_title')}
        </Text>
      </AppShell.Header>
      <AppShell.Navbar p="md" className="flex flex-col justify-between">
        <div>
          <Link
            href={ROUTES.admin.elections.index.absolutePath}
            label={t('common.elections')}
            leftSection={<Vote size={20} />}
            active={route.url.includes(ROUTES.admin.elections.index.relativePath)}
            className="font-medium"
          />
          <Link
            href={ROUTES.admin.candidates.index.absolutePath}
            label={t('common.candidates')}
            leftSection={<Users size={20} />}
            active={route.url.includes(ROUTES.admin.candidates.index.relativePath)}
            className="font-medium"
          />
        </div>

        <AdminLogoutForm className="w-full" />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
