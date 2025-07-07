import Election from '#models/election'
import { ElectionType, ElectionTypes } from '#shared/constants/elections'
import { Routes } from '#shared/constants/routes'
import { getRoute } from '#shared/functions/routes'
import { useForm } from '@inertiajs/react'
import { Button, Select, Text, TextInput, Title } from '@mantine/core'
import { DateValue } from '@mantine/dates'
import { FormEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminLayout } from '~/app/features/admin/layout'
import { Save } from '~/app/shared/components/icons'
import { DateTimePicker } from '~/app/shared/components/ui/date-time-picker'
import { toLocalTimezone } from '~/app/shared/functions'

interface Props {
  election?: Election
}

function AdminElectionCreate({ election }: Props) {
  const { t } = useTranslation()
  const { data, setData, post, put, errors, processing } = useForm({
    dateEnd: election?.dateEnd,
    dateStart: election?.dateStart,
    description: election?.description,
    electionType: election?.electionType,
    name: election?.name,
  })

  function onDateStartChange(value: DateValue) {
    if (!value) return

    const date = toLocalTimezone(value).toDate()
    setData('dateStart', date)

    if (!data.dateEnd || data.dateEnd < date) {
      setData('dateEnd', date)
    }
  }

  function onDateEndChange(value: DateValue) {
    if (!value) return

    const date = toLocalTimezone(value).toDate()
    setData('dateEnd', date)
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (election) {
      put(getRoute(Routes.admin.elections.id.absolutePath, { id: election.id }))
      return
    }

    post(Routes.admin.elections.create.absolutePath)
  }

  return (
    <>
      <Title order={1}>{t('new_election.title')}</Title>
      <Text>{t('new_election.description')}</Text>

      <form onSubmit={onSubmit} className="mt-8 space-y-6 max-w-[30rem]">
        <TextInput
          label={t('common.name')}
          placeholder={t('new_election.fields.name.placeholder')}
          withAsterisk
          required
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
          error={errors.name}
        />

        <TextInput
          label={t('common.description')}
          placeholder={t('new_election.fields.description.placeholder')}
          withAsterisk
          required
          value={data.description}
          onChange={(e) => setData('description', e.target.value)}
          error={errors.description}
        />

        <Select
          label={t('common.election_type')}
          placeholder={t('new_election.fields.description.placeholder')}
          withAsterisk
          required
          value={data.electionType}
          onChange={(value) => value && setData('electionType', value as ElectionType)}
          error={errors.electionType}
          data={Object.values(ElectionTypes).map((type) => ({
            label: t(`common.election_types.${type}`),
            value: type,
          }))}
        />

        <DateTimePicker
          label={t('common.date_start')}
          placeholder={t('new_election.fields.date_start.placeholder')}
          withAsterisk
          required
          value={data.dateStart}
          onChange={onDateStartChange}
          error={errors.dateStart}
        />

        <DateTimePicker
          label={t('common.date_end')}
          placeholder={t('new_election.fields.date_end.placeholder')}
          withAsterisk
          required
          value={data.dateEnd}
          onChange={onDateEndChange}
          minDate={data.dateStart}
          error={errors.dateEnd}
        />

        <div className="flex justify-end">
          <Button type="submit" leftSection={<Save />} disabled={processing}>
            {t('common.save')}
          </Button>
        </div>
      </form>
    </>
  )
}

AdminElectionCreate.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>

export default AdminElectionCreate
