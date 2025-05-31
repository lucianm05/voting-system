import Candidate from '#models/candidate'
import { Radio, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { cn } from '~/app/shared/functions'
import { PropsWithClassName } from '~/app/shared/types'

interface Props extends PropsWithClassName, Candidate {}

export function CandidateRadioCard({ className, id, name, type }: Props) {
  const { t } = useTranslation()

  return (
    <Radio.Card
      className={cn('flex items-center space-x-3 py-2 px-4', className)}
      radius="md"
      withBorder
      value={id}
    >
      <Radio.Indicator />
      <div className="flex flex-col">
        <Text>{name}</Text>
        <Text size="sm" c="gray">
          {t(`common.${type}`)}
        </Text>
      </div>
    </Radio.Card>
  )
}
