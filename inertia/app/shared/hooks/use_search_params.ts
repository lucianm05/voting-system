import { useMemo } from 'react'
import { useURL } from '~/app/shared/hooks/use_url'

export function useSearchParams() {
  const url = useURL()

  return useMemo(() => {
    if (!url) return null

    return url.searchParams
  }, [url])
}
