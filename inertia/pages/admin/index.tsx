import { ReactElement } from 'react'
import { AdminLayout } from '~/app/features/admin/layout'

function Admin() {
  return <div>Admin</div>
}

Admin.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

export default Admin
