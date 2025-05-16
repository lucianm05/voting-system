import { ROUTES } from '#shared/constants/routes'
import { usePage } from '@inertiajs/react'
import { AppShell } from '@mantine/core'
import { Check, Vote } from 'lucide-react'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '~/app/shared/ui/link'
import { LogoWithTitle } from '~/app/shared/ui/logo'

export function CitizenDashboardLayout({ children }: PropsWithChildren) {
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
            href={ROUTES.citizen.elections.absolutePath}
            label={t('common.elections')}
            leftSection={<Vote size={20} />}
            active={route.url.includes(ROUTES.citizen.elections.relativePath)}
            className="font-medium"
          />
          <Link
            href={ROUTES.citizen.myVote.absolutePath}
            label={t('citizen.dashboard.verify_vote')}
            leftSection={<Check size={20} />}
            active={route.url.includes(ROUTES.citizen.myVote.relativePath)}
            className="font-medium"
          />
        </div>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
