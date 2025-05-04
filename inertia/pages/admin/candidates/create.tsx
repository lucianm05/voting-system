import Election from '#models/election'
import { CANDIDATE_TYPES } from '#shared/constants/candidates'
import { ROUTES } from '#shared/constants/routes'
import { useForm } from '@inertiajs/react'
import { Button, Select, Text, TextInput, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Save } from 'lucide-react'
import { FormEvent, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminLayout } from '~/app/features/admin/layout'
import { useElectionIdParam } from '~/app/hooks/use_election_id_param'

interface Props {
  elections: Election[]
}

function AdminCandidateCreate({ elections }: Props) {
  const { t } = useTranslation()
  const { electionId } = useElectionIdParam()
  const { data, setData, post, errors, processing, reset } = useForm<{
    name: string
    type: string
    electionId: string
  }>({ name: '', type: '', electionId: electionId || '' })

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    post(ROUTES.admin.candidates.create.store.absolutePath, {
      onSuccess: () => {
        notifications.show({
          title: t('common.success'),
          message: t('new_candidate.candidate_created_successfully'),
          color: 'green',
        })
        reset('name')
      },
    })
  }

  return (
    <>
      <Title order={1}>{t('new_candidate.title')}</Title>
      <Text>{t('new_candidate.description')}</Text>

      <form onSubmit={onSubmit} className="mt-8 space-y-6 max-w-[30rem]">
        <TextInput
          label={t('common.name')}
          placeholder={t('new_candidate.fields.name.placeholder')}
          withAsterisk
          required
          value={data.name}
          error={errors.name}
          onChange={(e) => setData('name', e.target.value)}
        />

        <Select
          label={t('common.type')}
          placeholder={t('new_candidate.fields.type.placeholder')}
          withAsterisk
          required
          data={[
            { label: t('common.independent'), value: CANDIDATE_TYPES.independent },
            { label: t('common.party'), value: CANDIDATE_TYPES.party },
          ]}
          value={data.type}
          error={errors.type}
          onChange={(value) => value && setData('type', value)}
        />

        <Select
          label={t('common.election')}
          placeholder={t('new_candidate.fields.election_id.placeholder')}
          withAsterisk
          required
          data={elections.map((election) => ({ label: election.name, value: election.id }))}
          value={data.electionId}
          error={errors.electionId}
          onChange={(value) => value && setData('electionId', value)}
        />

        <div className="flex justify-end">
          <Button type="submit" leftSection={<Save size={20} />} disabled={processing}>
            {t('common.save')}
          </Button>
        </div>
      </form>
    </>
  )
}

AdminCandidateCreate.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

export default AdminCandidateCreate
