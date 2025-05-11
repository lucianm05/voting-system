import {
  createContext,
  PropsWithChildren,
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { loadFaceApi } from '~/app/features/face_api/functions'

interface State {
  isLoaded: boolean
  videoRef: RefObject<HTMLVideoElement | null>
  imageRef: RefObject<HTMLImageElement | null>
  // faceMatch: ReturnType<typeof useFaceMatch>
}

const FaceApiContext = createContext<State>({} as State)

/**
 * Loads the needed face-api.js models and updates the state when they are loaded successfully.
 */
export function FaceApiProvider({ children }: PropsWithChildren) {
  const [isLoaded, setIsLoaded] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

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
    return { isLoaded, videoRef, imageRef }
  }, [isLoaded])

  return <FaceApiContext.Provider value={value}>{children}</FaceApiContext.Provider>
}

export function useFaceApiContext() {
  return useContext(FaceApiContext)
}
