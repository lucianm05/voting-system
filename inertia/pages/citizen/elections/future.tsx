import Election from '#models/election'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ElectionsPage } from '~/app/features/citizen/dashboard/elections/components/elections_page'
import { CitizenDashboardLayout } from '~/app/features/citizen/dashboard/layout'

interface Props {
  elections?: Election[]
}

function FutureElections({ elections }: Props) {
  const { t } = useTranslation()

  return (
    <ElectionsPage
      elections={elections}
      title={t('citizen.dashboard.elections.future_title')}
      description={t('citizen.dashboard.elections.future_description')}
    />
  )
}

FutureElections.layout = (page: ReactNode) => (
  <CitizenDashboardLayout>{page}</CitizenDashboardLayout>
)

export default FutureElections
