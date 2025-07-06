import Election from '#models/election'
import { useTranslation } from 'react-i18next'
import { ElectionCard } from '~/app/features/citizen/dashboard/elections/components/election_card'

interface Props {
  elections: Election[] | undefined
}

export function ElectionsList({ elections }: Props) {
  const { t } = useTranslation()

  if (!elections) return null

  if (!elections.length) return <p>{t('citizen.dashboard.elections.no_elections')}</p>

  return (
    <ol className="mt-2 flex flex-col gap-y-4 gap-x-4 md:grid md:grid-cols-[repeat(auto-fit,25rem)]">
      {elections.map((election) => (
        <li key={election.id}>
          <ElectionCard {...election} />
        </li>
      ))}
    </ol>
  )
}
