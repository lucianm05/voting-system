import Election from '#models/election'
import { Routes } from '#shared/constants/routes'
import { getRoute } from '#shared/functions/routes'
import { Button, Modal, Table, TableData, Text, Title } from '@mantine/core'
import { ReactNode, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminLayout } from '~/app/features/admin/layout'
import { Pencil, Plus, Trash } from '~/app/shared/components/icons'
import { ButtonLink } from '~/app/shared/components/ui/link'
import { formatDate } from '~/app/shared/functions'

interface Props {
  elections: Election[]
}

function AdminElections({ elections }: Props) {
  const { t } = useTranslation()
  const [electionToDelete, setElectionToDelete] = useState<Election | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const tableData = useMemo<TableData>(() => {
    return {
      head: [
        t('common.name'),
        t('common.description'),
        t('common.election_type'),
        t('common.date_start'),
        t('common.date_end'),
      ],
      body: elections.map((election) => [
        election.name,
        election.description,
        t(`common.election_types.${election.electionType}`),
        formatDate(election.dateStart),
        formatDate(election.dateEnd),
        <div className="flex items-center justify-center">
          <ButtonLink
            href={getRoute(Routes.admin.elections.id.absolutePath, { id: election.id })}
            variant="transparent"
            size="compact-sm"
          >
            <Pencil width={20} height={20} />
          </ButtonLink>
          <Button
            variant="transparent"
            size="compact-sm"
            color="red"
            onClick={() => setElectionToDelete(election)}
          >
            <Trash width={20} height={20} />
          </Button>
        </div>,
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

      <div className="overflow-x-auto">
        <Table data={tableData} className="mt-6" />
      </div>

      <Modal
        title={t('common.are_you_sure')}
        opened={Boolean(electionToDelete)}
        onClose={() => setElectionToDelete(null)}
        centered
      >
        <Text size="sm">
          {t('elections.delete_confirm_message', { x: electionToDelete?.name })}
        </Text>

        <div className="flex items-center justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={() => setElectionToDelete(null)} disabled={isDeleting}>
            {t('common.cancel')}
          </Button>
          {electionToDelete && (
            <ButtonLink
              href={{
                url: getRoute(Routes.admin.elections.id.absolutePath, { id: electionToDelete.id }),
                method: 'delete',
              }}
              onStart={() => setIsDeleting(true)}
              onSuccess={() => setElectionToDelete(null)}
              onFinish={() => setIsDeleting(false)}
              color="red"
              disabled={isDeleting}
            >
              {t('common.confirm')}
            </ButtonLink>
          )}
        </div>
      </Modal>
    </>
  )
}

AdminElections.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>

export default AdminElections
