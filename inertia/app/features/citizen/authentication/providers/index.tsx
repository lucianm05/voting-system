import { InertiaFormProps, useForm } from '@inertiajs/react'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'

interface State {
  form: InertiaFormProps<{ file: File | null }>
}

const CitizenAuthenticationContext = createContext<State>({} as State)

export function CitizenAuthenticationProvider({ children }: PropsWithChildren) {
  const form = useForm<{ file: File | null }>({ file: null })

  const value = useMemo(() => {
    return { form }
  }, [form])

  return (
    <CitizenAuthenticationContext.Provider value={value}>
      {children}
    </CitizenAuthenticationContext.Provider>
  )
}

export function useCitizenAuthenticationContext() {
  return useContext(CitizenAuthenticationContext)
}
