import Election from '#models/election'
import { ElectionStatistics } from '#shared/types/index'
import { BarChart, PieChart } from '@mantine/charts'
import { Title } from '@mantine/core'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CitizenDashboardLayout } from '~/app/features/citizen/dashboard/layout'
import { GraphContainer } from '~/app/features/citizen/dashboard/results/graph_container'
import { LOCALE } from '~/app/shared/constants'

interface Props {
  election: Election
  statistics: ElectionStatistics
}

function ElectionResults({ election, statistics }: Props) {
  const { t } = useTranslation()

  const labels = {
    allVotes: t('citizen.dashboard.statistics.all_votes'),
    registeredVotes: t('citizen.dashboard.statistics.registered_votes'),
    revokedVotes: t('citizen.dashboard.statistics.revoked_votes'),
    votes: t('citizen.dashboard.statistics.number_of_votes'),
  }

  return (
    <main>
      <Title order={1}>
        {t('citizen.dashboard.statistics.title', { electionName: election.name })}
      </Title>

      <div className="mt-12 flex flex-wrap gap-x-8 gap-y-6">
        <GraphContainer label={t('citizen.dashboard.statistics.vote_results')}>
          <BarChart
            w={300}
            h={300}
            dataKey="name"
            withLegend
            withXAxis={false}
            data={statistics.results.map((r) => ({
              name: r.candidate.name,
              [labels.votes]: r.votes,
            }))}
            series={[{ name: labels.votes, color: 'blue' }]}
          />
        </GraphContainer>

        <GraphContainer label={t('citizen.dashboard.statistics.votes_distribution')}>
          <BarChart
            w={300}
            h={300}
            dataKey="type"
            withLegend
            withXAxis={false}
            valueFormatter={(value) => new Intl.NumberFormat(LOCALE).format(value)}
            data={[
              {
                type: t('citizen.dashboard.statistics.votes_distribution'),
                [labels.allVotes]: statistics.allVotes,
                [labels.registeredVotes]: statistics.registeredVotes,
                [labels.revokedVotes]: statistics.revokedVotes,
              },
            ]}
            series={[
              { name: labels.allVotes, color: 'blue', stackId: 'a' },
              { name: labels.registeredVotes, color: 'green', stackId: 'b' },
              { name: labels.revokedVotes, color: 'gray', stackId: 'b' },
            ]}
          />
        </GraphContainer>

        <GraphContainer label={t('citizen.dashboard.statistics.votes_distribution_percentage')}>
          <PieChart
            w={300}
            h={300}
            withLabels
            withTooltip
            labelsPosition="outside"
            labelsType="percent"
            data={[
              { name: labels.registeredVotes, value: statistics.registeredVotes, color: 'green' },
              { name: labels.revokedVotes, value: statistics.revokedVotes, color: 'gray' },
            ]}
          />
        </GraphContainer>
      </div>
    </main>
  )
}

ElectionResults.layout = (page: ReactNode) => (
  <CitizenDashboardLayout>{page}</CitizenDashboardLayout>
)

export default ElectionResults
