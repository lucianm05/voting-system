import { useForm } from '@inertiajs/react'
import { Button, Text, TextInput, Title } from '@mantine/core'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { DateInput } from '~/app/components/date-input'
import { AdminLayout } from '~/app/features/admin/layout'

function AdminNewElection() {
  const { t } = useTranslation()
  const { data, setData } = useForm({
    name: '',
    description: '',
    dateStart: new Date(),
    dateEnd: new Date(),
  })

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

  return (
    <>
      <Title order={1}>{t('new_election.title')}</Title>
      <Text>{t('new_election.description')}</Text>

      <form className="mt-8 space-y-6 max-w-[30rem]">
        <TextInput
          label={t('common.name')}
          placeholder={t('new_election.fields.name.placeholder')}
          withAsterisk
          required
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
        />

        <TextInput
          label={t('common.description')}
          placeholder={t('new_election.fields.description.placeholder')}
          withAsterisk
          required
          value={data.description}
          onChange={(e) => setData('description', e.target.value)}
        />

        <DateInput
          label={t('common.date_start')}
          placeholder={t('new_election.fields.date_start.placeholder')}
          withAsterisk
          required
          value={data.dateStart}
          onChange={onDateStartChange}
          minDate={new Date()}
        />

        <DateInput
          label={t('common.date_end')}
          placeholder={t('new_election.fields.date_end.placeholder')}
          withAsterisk
          required
          value={data.dateEnd}
          onChange={onDateEndChange}
          minDate={data.dateStart}
        />

        <div className="flex justify-end">
          <Button>{t('common.submit')}</Button>
        </div>
      </form>
    </>
  )
}

AdminNewElection.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>

export default AdminNewElection
