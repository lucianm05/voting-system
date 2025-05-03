import { ROUTES } from '#shared/constants/routes'
import { useForm } from '@inertiajs/react'
import { Button, Text, TextInput, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Save } from 'lucide-react'
import { FormEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { DateTimePicker } from '~/app/components/ui/date-time-picker'
import { AdminLayout } from '~/app/features/admin/layout'

function AdminElectionCreate() {
  const { t } = useTranslation()
  const { data, setData, post, errors, processing } = useForm<{
    name: string
    description: string
    dateStart: Date
    dateEnd: Date
  }>()

  function onDateStartChange(value: Date | null) {
    if (!value) return

    setData('dateStart', value)

    if (data.dateEnd < value) {
      setData('dateEnd', value)
    }
  }

  function onDateEndChange(value: Date | null) {
    if (!value) return

    setData('dateEnd', value)
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    post(ROUTES.admin.elections.create.store.absolutePath, {
      onSuccess: () => {
        notifications.show({
          title: t('common.success'),
          message: t('new_election.election_created_successfully'),
          color: 'green',
        })
      },
    })
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

        <DateTimePicker
          label={t('common.date_start')}
          placeholder={t('new_election.fields.date_start.placeholder')}
          withAsterisk
          required
          value={data.dateStart}
          onChange={onDateStartChange}
          minDate={new Date()}
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
          <Button type="submit" leftSection={<Save size={20} />} disabled={processing}>
            {t('common.save')}
          </Button>
        </div>
      </form>
    </>
  )
}

AdminElectionCreate.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>

export default AdminElectionCreate
