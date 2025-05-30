import Candidate from '#models/candidate'
import Election from '#models/election'
import { Routes } from '#shared/constants/routes'
import { SearchParams } from '#shared/constants/search_params'
import { Select, Table, TableData, Title } from '@mantine/core'
import { ReactElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminLayout } from '~/app/features/admin/layout'
import { Plus } from '~/app/shared/components/icons'
import { useElectionIdParam } from '~/app/shared/hooks/url_params/use_election_id_param'
import { ButtonLink } from '~/app/shared/ui/link'

interface Props {
  elections: Election[]
  candidates: Candidate[]
}

function AdminCandidates({ elections, candidates }: Props) {
  const { t } = useTranslation()
  const { electionId, setElectionId } = useElectionIdParam()

  const tableData = useMemo<TableData>(() => {
    return {
      head: ['Index', t('common.name'), t('common.type'), t('common.county'), t('common.locality')],
      body: candidates.map((candidate, index) => [
        index + 1,
        candidate.name,
        t(`common.${candidate.type}`),
        candidate.county,
        candidate.locality,
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

      <Table data={tableData} className="mt-6" />
    </>
  )
}

AdminCandidates.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

export default AdminCandidates
