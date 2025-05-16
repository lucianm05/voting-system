import Election from '#models/election'
import { ROUTES } from '#shared/constants/routes'
import { Table, TableData, Title } from '@mantine/core'
import { Plus } from 'lucide-react'
import { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminLayout } from '~/app/features/admin/layout'
import { formatDate } from '~/app/shared/functions'
import { ButtonLink } from '~/app/shared/ui/link'

interface Props {
  elections: Election[]
}

function AdminElections({ elections }: Props) {
  const { t } = useTranslation()

  const tableData = useMemo<TableData>(() => {
    return {
      head: [
        'Index',
        t('common.name'),
        t('common.description'),
        t('common.election_type'),
        t('common.date_start'),
        t('common.date_end'),
      ],
      body: elections.map((election, i) => [
        i + 1,
        election.name,
        election.description,
        t(`common.election_types.${election.electionType}`),
        formatDate(election.dateStart),
        formatDate(election.dateEnd),
      ]),
    }
  }, [elections])

  return (
    <>
      <div className="flex items-center justify-between">
        <Title order={1}>{t('elections.title')}</Title>

        <div>
          <ButtonLink
            href={ROUTES.admin.elections.create.absolutePath}
            leftSection={<Plus size={20} />}
          >
            {t('common.add')}
          </ButtonLink>
        </div>
      </div>

      <Table data={tableData} className="mt-6" />
    </>
  )
}

AdminElections.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>

export default AdminElections
