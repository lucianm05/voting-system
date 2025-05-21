import { SEARCH_PARAMS } from '#shared/constants/search_params'
import { useURLParam } from '~/app/shared/hooks/url_params/use_url_param'

export function useElectionIdParam() {
  const { param, setParam } = useURLParam({ key: SEARCH_PARAMS.electionId })

  return { electionId: param, setElectionId: setParam }
}
