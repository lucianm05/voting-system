import Candidate from '#models/candidate'
import Election from '#models/election'
import { Routes } from '#shared/constants/routes'
import { useForm } from '@inertiajs/react'
import { Button, Radio, Text, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { FormEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CitizenDashboardLayout } from '~/app/features/citizen/dashboard/layout'
import { CandidateRadioCard } from '~/app/features/citizen/dashboard/vote/components/candidate_radio_card'

interface Props {
  election: Election
  candidates: Candidate[]
}

function ElectionVote({ election, candidates }: Props) {
  const { t } = useTranslation()
  const { data, setData, post } = useForm<{ electionId: string; candidateId?: string }>({
    electionId: election.id,
  })

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log('submitting vote...')
    post(Routes.citizen.elections.vote.absolutePath, {
      onSuccess: () => {
        notifications.show({
          color: 'green',
          title: t('common.success'),
          message: t('citizen.dashboard.vote.voted_successfully'),
        })
      },
    })
  }

  return (
    <main>
      <Title order={1}>{election.name}</Title>
      <Text>{t('citizen.dashboard.vote.description')}</Text>

      <form onSubmit={onSubmit} className="mt-4 md:mt-6">
        <Radio.Group
          aria-label={t('citizen.dashboard.vote.description')}
          name="candidate"
          className="max-w-[52rem]"
          required
          value={data.candidateId}
          onChange={(value) => setData('candidateId', value)}
        >
          <div className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(25rem,auto))] gap-y-4 md:gap-x-4 md:gap-y-4">
            {candidates.map((candidate) => (
              <CandidateRadioCard key={candidate.id} {...candidate} className="md:max-w-[25rem]" />
            ))}
          </div>
        </Radio.Group>

        <Button type="submit" className="mt-4 md:mt-6" disabled={!data.candidateId}>
          {t('common.send')}
        </Button>
      </form>
    </main>
  )
}

ElectionVote.layout = (page: ReactNode) => <CitizenDashboardLayout>{page}</CitizenDashboardLayout>

export default ElectionVote
