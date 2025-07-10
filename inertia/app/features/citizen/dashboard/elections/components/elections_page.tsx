import Election from '#models/election'
import { Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { ElectionsList } from '~/app/features/citizen/dashboard/elections/components/elections_list'

interface Props {
  title: string
  description: string
  elections?: Election[]
}

export function ElectionsPage({ elections, title, description }: Props) {
  const { t } = useTranslation()

  return (
    <main className="space-y-8">
      <div>
        <Title order={1}>{t(title)}</Title>
        <Text>
          {!elections?.length ? t('citizen.dashboard.elections.no_elections') : t(description)}
        </Text>
      </div>

      <div className="space-y-12">
        <ElectionsList elections={elections} />
      </div>
    </main>
  )
}
