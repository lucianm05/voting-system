import Candidate from '#models/candidate'
import Election from '#models/election'
import { ROUTES } from '#shared/constants/routes'
import { SEARCH_PARAMS } from '#shared/constants/search_params'
import { Select, Table, TableData, Title } from '@mantine/core'
import { Plus } from 'lucide-react'
import { ReactElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonLink } from '~/app/components/ui/link'
import { AdminLayout } from '~/app/features/admin/layout'
import { useElectionIdParam } from '~/app/hooks/use_election_id_param'

interface Props {
  elections: Election[]
  candidates: Candidate[]
}

function AdminCandidates({ elections, candidates }: Props) {
  const { t } = useTranslation()
  const { electionId, setElectionId } = useElectionIdParam({
    visitOptions: {
      only: ['candidates'],
    },
  })

  const tableData = useMemo<TableData>(() => {
    return {
      head: ['Index', t('common.name'), t('common.type')],
      body: candidates.map((candidate, index) => [
        index + 1,
        candidate.name,
        t(`common.${candidate.type}`),
      ]),
    }
  }, [candidates])

  return (
    <>
      <div className="flex items-center justify-between">
        <Title order={1}>{t('candidates.title')}</Title>

        <div>
          <ButtonLink
            href={`${ROUTES.admin.candidates.create.index.absolutePath}?${SEARCH_PARAMS.electionId}=${electionId}`}
            leftSection={<Plus size={20} />}
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
        onChange={setElectionId}
        data={elections.map((election) => ({ label: election.name, value: election.id }))}
        className="mt-6"
      />

      <Table data={tableData} className="mt-6" />
    </>
  )
}

AdminCandidates.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

export default AdminCandidates
