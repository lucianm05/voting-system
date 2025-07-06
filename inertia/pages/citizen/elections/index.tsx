import Election from '#models/election'
import { Text, Title } from '@mantine/core'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ElectionsSection } from '~/app/features/citizen/dashboard/elections/components/elections_section'
import { CitizenDashboardLayout } from '~/app/features/citizen/dashboard/layout'

interface Props {
  activeElections?: Election[]
  futureElections?: Election[]
  endedElections?: Election[]
}

function CitizenElections({ activeElections, futureElections, endedElections }: Props) {
  const { t } = useTranslation()

  return (
    <main className="space-y-8">
      <div>
        <Title order={1}>{t('citizen.dashboard.elections.title')}</Title>
        <Text>
          {!activeElections?.length && !endedElections?.length && !futureElections?.length
            ? t('citizen.dashboard.elections.no_elections')
            : t('citizen.dashboard.elections.description')}
        </Text>
      </div>

      <div className="space-y-12">
        <ElectionsSection
          title={t('citizen.dashboard.elections.active_title')}
          elections={activeElections}
        />

        <ElectionsSection
          title={t('citizen.dashboard.elections.future_title')}
          elections={futureElections}
        />

        <ElectionsSection
          title={t('citizen.dashboard.elections.ended_title')}
          elections={endedElections}
        />
      </div>
    </main>
  )
}

CitizenElections.layout = (page: ReactNode) => (
  <CitizenDashboardLayout>{page}</CitizenDashboardLayout>
)

export default CitizenElections
