import { ReactNode } from 'react'
import { CitizenDashboardLayout } from '~/app/features/citizen/dashboard/layout'

function CitizenElections() {
  return <main>elections</main>
}

CitizenElections.layout = (page: ReactNode) => (
  <CitizenDashboardLayout>{page}</CitizenDashboardLayout>
)

export default CitizenElections
