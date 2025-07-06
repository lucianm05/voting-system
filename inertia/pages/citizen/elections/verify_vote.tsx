import Candidate from '#models/candidate'
import Election from '#models/election'
import { Text, Title } from '@mantine/core'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CitizenDashboardLayout } from '~/app/features/citizen/dashboard/layout'

interface Props {
  election: Election
  candidate?: Candidate
}

function ElectionVerifyVote({ candidate, election }: Props) {
  const { t } = useTranslation()

  return (
    <main>
      <Title order={1}>{t('citizen.dashboard.verify_vote.title')}</Title>
      <div>
        <Text fw={500}>
          {t('common.election')}: <span className="font-normal">{election.name}</span>
        </Text>
        <Text fw={500}>
          {t('citizen.dashboard.verify_vote.voted_candidate')}:{' '}
          <span className="font-normal">
            {candidate?.name || t('citizen.dashboard.verify_vote.none')}
          </span>
        </Text>
      </div>
    </main>
  )
}

ElectionVerifyVote.layout = (page: ReactNode) => (
  <CitizenDashboardLayout>{page}</CitizenDashboardLayout>
)

export default ElectionVerifyVote
