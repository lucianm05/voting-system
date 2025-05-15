import { SEARCH_PARAMS } from '#shared/constants/search_params'
import { router } from '@inertiajs/react'
import { useMemo } from 'react'
import { useURL } from '~/app/shared/hooks/use_url'

interface Config {
  visitOptions?: Parameters<typeof router.visit>[1]
}

export function useElectionIdParam(config: Config = {}) {
  const url = useURL()

  const electionId = useMemo(() => {
    if (!url) return null

    return url.searchParams.get(SEARCH_PARAMS.electionId)
  }, [url])

  function setElectionId(id: string | null) {
    if (!url) return

    if (id) {
      url.searchParams.set(SEARCH_PARAMS.electionId, id)
    } else {
      url.searchParams.delete(SEARCH_PARAMS.electionId)
    }

    router.visit(url, config.visitOptions)
  }

  return { electionId, setElectionId }
}
