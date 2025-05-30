import Election from '#models/election'
import { ROUTES } from '#shared/constants/routes'
import { getRoute } from '#shared/functions/routes'
import { Badge, Card, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { ButtonLink } from '~/app/shared/ui/link'

export function ElectionCard({ id, name, description, electionType }: Election) {
  const { t } = useTranslation()

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <div className="flex items-center justify-between mb-1">
        <Text>{name}</Text>

        <Badge>{t(`common.election_types.${electionType}`)}</Badge>
      </div>

      <Text size="sm" c="gray">
        {description}
      </Text>

      <ButtonLink
        href={getRoute(ROUTES.citizen.elections.vote.absolutePath, { id })}
        className="mt-4 md:mt-6"
      >
        {t('common.vote')}
      </ButtonLink>
    </Card>
  )
}
