import Election from '#models/election'
import { Text, Title } from '@mantine/core'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ElectionCard } from '~/app/features/citizen/dashboard/elections/components/election_card'
import { CitizenDashboardLayout } from '~/app/features/citizen/dashboard/layout'

interface Props {
  elections?: Election[]
}

function CitizenElections({ elections }: Props) {
  const { t } = useTranslation()

  return (
    <main>
      <Title order={1}>{t('citizen.dashboard.elections.title')}</Title>
      {!elections && <Text>{t('citizen.dashboard.elections.no_active_elections')}</Text>}

      {elections && (
        <ol className="mt-4 md:mt-6 flex flex-col gap-y-4 gap-x-4 md:grid md:grid-cols-[repeat(auto-fit,25rem)]">
          {elections.map((election) => (
            <li key={election.id}>
              <ElectionCard {...election} />
            </li>
          ))}
        </ol>
      )}
    </main>
  )
}

CitizenElections.layout = (page: ReactNode) => (
  <CitizenDashboardLayout>{page}</CitizenDashboardLayout>
)

export default CitizenElections
