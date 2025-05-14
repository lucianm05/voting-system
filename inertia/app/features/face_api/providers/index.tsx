import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'
import { loadFaceApi } from '~/app/features/face_api/functions'

interface State {
  isLoaded: boolean
}

const FaceApiContext = createContext<State>({} as State)

/**
 * Loads the needed face-api.js models and updates the state when they are loaded successfully.
 */
export function FaceApiProvider({ children }: PropsWithChildren) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    loadFaceApi()
      .then(() => {
        console.log('✔️ FaceApi loaded')
        setIsLoaded(true)
      })
      .catch((error) => {
        console.error('FaceApi could not be loaded')
        console.error(error)
      })
  }, [])

  const value = useMemo(() => {
    return { isLoaded }
  }, [isLoaded])

  return <FaceApiContext.Provider value={value}>{children}</FaceApiContext.Provider>
}

export function useFaceApiContext() {
  return useContext(FaceApiContext)
}
