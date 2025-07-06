import Election from '#models/election'
import { Routes } from '#shared/constants/routes'
import { isFuture, isPast, isPresent } from '#shared/functions/dates'
import { getRoute } from '#shared/functions/routes'
import { Badge, Card, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { Countdown } from '~/app/shared/components/ui/countdown'
import { ButtonLink } from '~/app/shared/ui/link'

export function ElectionCard({
  id,
  name,
  description,
  electionType,
  dateStart,
  dateEnd,
}: Election) {
  const { t } = useTranslation()

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="space-y-4 md:space-y-6">
      <div>
        <div className="flex items-center justify-between mb-1">
          <Text>{name}</Text>

          <Badge>{t(`common.election_types.${electionType}`)}</Badge>
        </div>

        <Text size="sm" c="gray">
          {description}
        </Text>
      </div>

      {isPresent(dateStart, dateEnd) && (
        <ButtonLink href={getRoute(Routes.citizen.elections.vote.absolutePath, { id })}>
          {t('common.vote')}
        </ButtonLink>
      )}

      {isFuture(dateStart) && <Countdown endDate={dateStart} className="w-full" />}

      {isPast(dateEnd) && (
        <ButtonLink href={getRoute(Routes.citizen.elections.results.absolutePath, { id })}>
          {t('common.view_results')}
        </ButtonLink>
      )}
    </Card>
  )
}
