import Election from '#models/election'
import { CandidateTypes } from '#shared/constants/candidates'
import { Routes } from '#shared/constants/routes'
import { isElection } from '#shared/functions/elections'
import { County, Locality } from '#shared/types/index'
import { router, useForm } from '@inertiajs/react'
import { Button, Select, Text, TextInput, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { FormEvent, ReactElement, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminLayout } from '~/app/features/admin/layout'
import { Save } from '~/app/shared/components/icons'
import { useAutoCodeParam } from '~/app/shared/hooks/url_params/use_auto_code_param'
import { useElectionIdParam } from '~/app/shared/hooks/url_params/use_election_id_param'

interface Props {
  elections: Election[]
  counties?: County[]
  localities?: Locality[]
}

function AdminCandidateCreate({ elections, counties, localities }: Props) {
  const { t } = useTranslation()

  const { electionId, setElectionId } = useElectionIdParam()
  const { autoCode, setAutoCode } = useAutoCodeParam()

  const { data, setData, post, errors, processing, reset } = useForm<{
    name: string
    type: string
    electionId: string
    county?: string | null
    locality?: string | null
  }>({ name: '', type: '', electionId: electionId || '', county: autoCode })

  const { needsCounties, needsLocalities } = useMemo(() => {
    const election = getElection(data.electionId)

    return {
      currentElection: election,
      needsCounties: Boolean(election?.is?.local || election?.is?.county),
      needsLocalities: Boolean(election?.is?.local),
    }
  }, [elections, data.electionId])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    function loadData() {
      const only: string[] = []

      if (needsCounties && !counties) {
        only.push('counties')
      }

      if (needsLocalities && data.county) {
        only.push('localities')
      }

      timeout = setTimeout(() => {
        if (only.length) {
          router.reload({ only })
        }
      }, 500)
    }

    loadData()

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  function getElection(id: string) {
    const election = elections.find((e) => e.id === id)
    if (!election) return null

    return { ...election, is: isElection(election) }
  }

  function onUpdateElection(value: string | null) {
    if (!value) return

    const newElection = getElection(value)
    if (!newElection) return

    const fetchCounties = !counties && (newElection.is.county || newElection.is.local)

    setData('electionId', value)
    setElectionId(value, {
      only: fetchCounties ? ['counties'] : undefined,
    })
  }

  function onUpdateCounty(value: string | null) {
    if (!value) return

    setData('county', value)
    setAutoCode(value, { only: ['localities'] })
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    post(Routes.admin.candidates.create.absolutePath, {
      onSuccess: () => {
        notifications.show({
          title: t('common.success'),
          message: t('new_candidate.candidate_created_successfully'),
          color: 'green',
        })
        reset('name')
      },
    })
  }

  return (
    <>
      <Title order={1}>{t('new_candidate.title')}</Title>
      <Text>{t('new_candidate.description')}</Text>

      <form onSubmit={onSubmit} className="mt-8 space-y-6 max-w-[30rem]">
        <TextInput
          label={t('common.name')}
          placeholder={t('new_candidate.fields.name.placeholder')}
          withAsterisk
          required
          value={data.name}
          error={errors.name}
          onChange={(e) => setData('name', e.target.value)}
        />

        <Select
          label={t('common.type')}
          placeholder={t('new_candidate.fields.type.placeholder')}
          withAsterisk
          required
          data={[
            { label: t('common.independent'), value: CandidateTypes.independent },
            { label: t('common.party'), value: CandidateTypes.party },
          ]}
          value={data.type}
          error={errors.type}
          onChange={(value) => value && setData('type', value)}
        />

        <Select
          label={t('common.election')}
          placeholder={t('new_candidate.fields.election_id.placeholder')}
          withAsterisk
          required
          data={elections.map((election) => ({ label: election.name, value: election.id }))}
          value={data.electionId}
          error={errors.electionId}
          onChange={onUpdateElection}
        />

        {needsCounties && counties && (
          <Select
            label={t('common.county')}
            placeholder={t('new_candidate.fields.county.placeholder')}
            withAsterisk
            required
            data={counties.map((county) => ({ label: county.nume, value: county.auto }))}
            value={data.county}
            error={errors.county}
            onChange={onUpdateCounty}
            searchable
          />
        )}

        {needsLocalities && localities && (
          <Select
            label={t('common.locality')}
            placeholder={t('new_candidate.fields.locality.placeholder')}
            withAsterisk
            required
            data={localities.map((locality) => ({
              label: locality.nume,
              value: locality.simplu || locality.nume,
            }))}
            value={data.locality}
            error={errors.locality}
            onChange={(value) => value && setData('locality', value)}
            searchable
          />
        )}

        <div className="flex justify-end">
          <Button type="submit" leftSection={<Save />} disabled={processing}>
            {t('common.save')}
          </Button>
        </div>
      </form>
    </>
  )
}

AdminCandidateCreate.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

export default AdminCandidateCreate
