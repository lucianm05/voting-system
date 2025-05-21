import { SEARCH_PARAMS } from '#shared/constants/search_params'
import { useURLParam } from '~/app/shared/hooks/url_params/use_url_param'

export function useAutoCodeParam() {
  const { param, setParam } = useURLParam({ key: SEARCH_PARAMS.autoCode })

  return { autoCode: param, setAutoCode: setParam }
}
