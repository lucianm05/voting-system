import Election from '#models/election'
import { Routes } from '#shared/constants/routes'
import { isElectionActive, isElectionFuture, isElectionPast } from '#shared/functions/elections'
import { getRoute } from '#shared/functions/routes'
import { Badge, Card, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { Countdown } from '~/app/shared/components/ui/countdown'
import { ButtonLink } from '~/app/shared/components/ui/link'

export function ElectionCard(election: Election) {
  const { t } = useTranslation()
  const { id, name, description, electionType, dateStart } = election

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="space-y-4 md:space-y-6">
      <div>
        <div className="mb-2 md:mb-4">
          <Badge>{t(`common.election_types.${electionType}`)}</Badge>
        </div>
        <Text>{name}</Text>
        <Text size="sm" c="gray">
          {description}
        </Text>
      </div>

      <div className="flex flex-col">
        {isElectionFuture(election) && <Countdown endDate={dateStart} className="w-full" />}

        {isElectionActive(election) && (
          <>
            <ButtonLink href={getRoute(Routes.citizen.elections.vote.absolutePath, { id })}>
              {t('common.vote')}
            </ButtonLink>
            <ButtonLink
              href={getRoute(Routes.citizen.elections.verifyVote.absolutePath, { id: election.id })}
              variant="transparent"
            >
              {t('citizen.dashboard.elections.verify_vote')}
            </ButtonLink>
          </>
        )}

        {isElectionPast(election) && (
          <ButtonLink href={getRoute(Routes.citizen.elections.results.absolutePath, { id })}>
            {t('common.view_results')}
          </ButtonLink>
        )}
      </div>
    </Card>
  )
}
