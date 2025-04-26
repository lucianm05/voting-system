import { ReactElement } from 'react'
import { AdminLayout } from '~/app/features/admin/layout'

function AdminElections() {
  return <>elections</>
}

AdminElections.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

export default AdminElections
