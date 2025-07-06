import { Button, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { CardWithLogo } from '~/app/shared/components/ui/card-with-logo'

interface Props {
  onStart: () => void
}

export function InstructionsCard({ onStart }: Props) {
  const { t } = useTranslation()

  return (
    <CardWithLogo>
      <div className="px-4 py-4 space-y-4 md:px-8">
        <div className="space-y-2">
          <Title size="xl">{t('citizen.authentication.validation.title')}</Title>
          <div className="space-y-2">
            <Text size="sm">{t('citizen.authentication.validation.description_1')}</Text>
            <Text size="sm">{t('citizen.authentication.validation.description_2')}</Text>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onStart}>{t('common.start')}</Button>
        </div>
      </div>
    </CardWithLogo>
  )
}
