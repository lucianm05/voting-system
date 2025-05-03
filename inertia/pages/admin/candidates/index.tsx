import { ROUTES } from '#shared/constants/routes'
import { Title } from '@mantine/core'
import { Plus } from 'lucide-react'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonLink } from '~/app/components/ui/link'
import { AdminLayout } from '~/app/features/admin/layout'

function AdminCandidates() {
  const { t } = useTranslation()

  return (
    <>
      <div className="flex items-center justify-between">
        <Title order={1}>{t('candidates.title')}</Title>

        <div>
          <ButtonLink
            href={ROUTES.admin.candidates.create.index.absolutePath}
            leftSection={<Plus size={20} />}
          >
            {t('common.add')}
          </ButtonLink>
        </div>
      </div>
    </>
  )
}

AdminCandidates.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

export default AdminCandidates
