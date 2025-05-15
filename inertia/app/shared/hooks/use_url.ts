import { usePage } from '@inertiajs/react'
import { useMemo } from 'react'

export function useURL() {
  const page = usePage()

  return useMemo(() => {
    if (typeof window === 'undefined') return null

    return new URL(window.location.href)
  }, [page.url])
}
