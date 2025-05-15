import { useMemo } from 'react'

interface Config {
  file: File | null
}

export function useLocalFileURL({ file }: Config) {
  return useMemo(() => {
    if (!file) return null

    return URL.createObjectURL(file)
  }, [file])
}
