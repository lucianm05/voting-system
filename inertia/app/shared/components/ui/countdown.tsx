import { DayjsCompatibleDate } from '#shared/types/index'
import { Badge, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { cn } from '~/app/shared/functions'
import { useCountdown } from '~/app/shared/hooks/use_countdown'
import { PropsWithClassName } from '~/app/shared/types'

interface Props extends PropsWithClassName {
  endDate: DayjsCompatibleDate
}

export function Countdown({ endDate, className }: Props) {
  const { t } = useTranslation()
  const countdown = useCountdown(endDate)

  return (
    <Badge className={cn(className)} variant="outline" size="xl" radius="sm">
      <Text>{t('common.days_hours_minutes_seconds', { ...countdown })}</Text>
    </Badge>
  )
}
