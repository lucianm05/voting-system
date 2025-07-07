import Candidate from '#models/candidate'
import Election from '#models/election'
import { CandidateTypes } from '#shared/constants/candidates'
import { Routes } from '#shared/constants/routes'
import { isElection } from '#shared/functions/elections'
import { getRoute } from '#shared/functions/routes'
import { County, Locality } from '#shared/types/index'
import { router, useForm, usePage } from '@inertiajs/react'
import { Button, Select, Text, TextInput, Title } from '@mantine/core'
import { FormEvent, ReactElement, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminLayout } from '~/app/features/admin/layout'
import { Save } from '~/app/shared/components/icons'
import { useAutoCodeParam } from '~/app/shared/hooks/url_params/use_auto_code_param'
import { useElectionIdParam } from '~/app/shared/hooks/url_params/use_election_id_param'

interface Props {
  elections: Election[]
  candidate?: Candidate
  counties?: County[]
  localities?: Locality[]
}

function AdminCandidateCreate({ elections, candidate, counties, localities }: Props) {
  const { t } = useTranslation()

  const page = usePage()
  const { electionId, setElectionId } = useElectionIdParam()
  const { autoCode, setAutoCode } = useAutoCodeParam()

  const { data, setData, post, put, errors, processing } = useForm({
    name: candidate?.name,
    type: candidate?.type,
    electionId: candidate?.electionId || electionId || '',
    county: candidate?.county || autoCode,
    locality: candidate?.locality,
  })

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
      const only = determineResources()

      timeout = setTimeout(() => {
        if (only.length) {
          router.visit(page.url, {
            only,
            preserveState: true,
            preserveScroll: true,
          })
        }
      }, 250)
    }

    loadData()

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  function determineResources() {
    const only: string[] = []

    if (needsCounties && !counties) {
      only.push('counties')
    }
    if (needsLocalities && data.county) {
      only.push('localities')
    }

    return only
  }

  function getElection(id: string) {
    const election = elections?.find((e) => e.id === id)
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
      only: fetchCounties ? ['counties'] : [],
      preserveState: true,
      preserveScroll: true,
    })
  }

  function onUpdateCounty(value: string | null) {
    if (!value) return

    setData('county', value)
    setAutoCode(value, { only: ['localities'], preserveState: true, preserveScroll: true })
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (candidate) {
      put(getRoute(Routes.admin.candidates.id.absolutePath, { id: candidate.id }))
      return
    }

    post(Routes.admin.candidates.create.absolutePath, {
      only: determineResources(),
      onSuccess: () => {
        setData('name', '')
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
              value: locality.nume,
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
