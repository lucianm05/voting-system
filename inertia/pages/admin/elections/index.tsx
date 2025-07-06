import Election from '#models/election'
import { Routes } from '#shared/constants/routes'
import { Table, TableData, Title } from '@mantine/core'
import { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminLayout } from '~/app/features/admin/layout'
import { Plus } from '~/app/shared/components/icons'
import { ButtonLink } from '~/app/shared/components/ui/link'
import { formatDate } from '~/app/shared/functions'

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
          <ButtonLink href={Routes.admin.elections.create.absolutePath} leftSection={<Plus />}>
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
