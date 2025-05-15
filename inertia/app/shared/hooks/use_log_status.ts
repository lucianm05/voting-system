import { useEffect } from 'react'

interface Config {
  name: string
  status: string | null
  color: string
}

export function useLogStatus({ name, status, color }: Config) {
  useEffect(() => {
    if (status) {
      console.log(`%c ${name} status: ${status}`, `color:${color}`)
    }
  }, [status])
}
