import { ROUTES } from '#shared/constants/routes'
import { Title } from '@mantine/core'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonLink } from '~/app/components/link'
import { AdminLayout } from '~/app/features/admin/layout'

function AdminElections() {
  const { t } = useTranslation()

  return (
    <>
      <div className="flex items-center justify-between">
        <Title order={1}>{t('elections.title')}</Title>

        <div>
          <ButtonLink href={ROUTES.admin.newElection.absolutePath}>{t('common.add')}</ButtonLink>
        </div>
      </div>
    </>
  )
}

AdminElections.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>

export default AdminElections
