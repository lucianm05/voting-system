import { router } from '@inertiajs/react'
import { useMemo } from 'react'
import { useURL } from '~/app/shared/hooks/use_url'
import { RouterVisitOptions } from '~/app/shared/types'

interface Config {
  key: string
}

export function useURLParam({ key }: Config) {
  const url = useURL()

  const param = useMemo(() => {
    if (!url) return null

    return url.searchParams.get(key)
  }, [url])

  function setParam(value: string | null, visitOptions?: RouterVisitOptions) {
    if (!url) return

    if (value) {
      url.searchParams.set(key, value)
    } else {
      url.searchParams.delete(key)
    }

    router.visit(url, visitOptions)
  }

  return { param, setParam }
}
