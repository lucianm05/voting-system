import { ROUTES } from '#shared/constants/routes'
import { usePage } from '@inertiajs/react'
import { AppShell, Burger } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Vote } from '~/app/shared/components/icons'
import { Link } from '~/app/shared/ui/link'
import { LogoWithTitle } from '~/app/shared/ui/logo'

export function CitizenDashboardLayout({ children }: PropsWithChildren) {
  const { t } = useTranslation()
  const route = usePage()
  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell
      padding="md"
      header={{ height: 72 }}
      navbar={{
        width: 300,
        breakpoint: 'md',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header className="flex items-center space-x-3 px-4">
        <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
        <LogoWithTitle />
      </AppShell.Header>
      <AppShell.Navbar p="md" className="flex flex-col justify-between">
        <div>
          <Link
            href={ROUTES.citizen.elections.index.absolutePath}
            label={t('common.elections')}
            leftSection={<Vote />}
            active={route.url.includes(ROUTES.citizen.elections.index.relativePath)}
            className="font-medium"
          />
          <Link
            href={ROUTES.citizen.myVote.absolutePath}
            label={t('citizen.dashboard.verify_vote')}
            leftSection={<Check />}
            active={route.url.includes(ROUTES.citizen.myVote.relativePath)}
            className="font-medium"
          />
        </div>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
