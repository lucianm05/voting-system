import Candidate from '#models/candidate'
import Election from '#models/election'
import { Routes } from '#shared/constants/routes'
import { SearchParams } from '#shared/constants/search_params'
import { getRoute } from '#shared/functions/routes'
import { Button, Modal, Select, Table, TableData, Text, Title } from '@mantine/core'
import { ReactElement, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminLayout } from '~/app/features/admin/layout'
import { Pencil, Plus, Trash } from '~/app/shared/components/icons'
import { ButtonLink } from '~/app/shared/components/ui/link'
import { useElectionIdParam } from '~/app/shared/hooks/url_params/use_election_id_param'

interface Props {
  elections: Election[]
  candidates: Candidate[]
}

function AdminCandidates({ elections, candidates }: Props) {
  const { t } = useTranslation()
  const { electionId, setElectionId } = useElectionIdParam()
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const tableData = useMemo<TableData>(() => {
    return {
      head: [t('common.name'), t('common.type'), t('common.county'), t('common.locality')],
      body: candidates.map((candidate) => [
        candidate.name,
        t(`common.${candidate.type}`),
        candidate.county,
        candidate.locality,
        <div className="flex items-center justify-center">
          <ButtonLink
            href={getRoute(Routes.admin.candidates.id.absolutePath, { id: candidate.id })}
            variant="transparent"
            size="compact-sm"
          >
            <Pencil width={20} height={20} />
          </ButtonLink>
          <Button
            variant="transparent"
            size="compact-sm"
            color="red"
            onClick={() => setCandidateToDelete(candidate)}
          >
            <Trash width={20} height={20} />
          </Button>
        </div>,
      ]),
    }
  }, [candidates])

  return (
    <>
      <div className="flex items-center justify-between">
        <Title order={1}>{t('candidates.title')}</Title>

        <div>
          <ButtonLink
            href={`${Routes.admin.candidates.create.absolutePath}?${SearchParams.electionId}=${electionId}`}
            leftSection={<Plus />}
          >
            {t('common.add')}
          </ButtonLink>
        </div>
      </div>

      <Select
        label={t('candidates.select_election')}
        placeholder={t('candidates.fields.election_id.placeholder')}
        withAsterisk
        defaultValue={electionId}
        onChange={(value) => value && setElectionId(value, { only: ['candidates'] })}
        data={elections.map((election) => ({ label: election.name, value: election.id }))}
        className="mt-6"
      />

      <div className="overflow-x-auto">
        <Table data={tableData} className="mt-6" />
      </div>

      <Modal
        title={t('common.are_you_sure')}
        opened={Boolean(candidateToDelete)}
        onClose={() => setCandidateToDelete(null)}
        centered
      >
        <Text size="sm">
          {t('candidates.delete_confirm_message', { x: candidateToDelete?.name })}
        </Text>

        <div className="flex items-center justify-end space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={() => setCandidateToDelete(null)}
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </Button>
          {candidateToDelete && (
            <ButtonLink
              href={{
                url: getRoute(Routes.admin.candidates.id.absolutePath, {
                  id: candidateToDelete.id,
                }),
                method: 'delete',
              }}
              onStart={() => setIsDeleting(true)}
              onSuccess={() => setCandidateToDelete(null)}
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

AdminCandidates.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

export default AdminCandidates
