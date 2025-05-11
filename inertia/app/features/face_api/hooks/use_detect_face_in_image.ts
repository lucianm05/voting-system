import { ValueOf } from '#shared/types/index'
import * as faceapi from 'face-api.js'
import { RefObject, useCallback, useMemo, useRef, useState } from 'react'
import { useLogStatus } from '~/app/hooks/use_log_status'

const MAX_RETRIES = 5

const STATUSES = {
  imageRefMissing: 'IMAGE_REF_MISSING',
  noFaceDetected: 'NO_FACE_DETECTED',
  loaded: 'LOADED',
} as const

interface Config {
  imageRef: RefObject<HTMLImageElement | null>
  label: string
}

export function useDetectFaceInImage({ imageRef, label }: Config) {
  const [descriptor, setDescriptor] = useState<faceapi.LabeledFaceDescriptors | null>()
  const [status, setStatus] = useState<ValueOf<typeof STATUSES> | null>(null)
  const interval = useRef<ReturnType<typeof setInterval> | null>(null)
  const retries = useRef(0)

  useLogStatus({ name: 'useDetectFaceInImage', color: 'cyan', status })

  const detectFace = useCallback(async () => {
    if (!imageRef.current) {
      setDescriptor(null)
      setStatus(STATUSES.imageRefMissing)
      return null
    }

    const detection = await faceapi
      .detectSingleFace(imageRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor()

    if (!detection) {
      setDescriptor(null)
      setStatus(STATUSES.noFaceDetected)
      return null
    }

    const descrpit = new faceapi.LabeledFaceDescriptors(label, [detection.descriptor])
    setDescriptor(descrpit)
    setStatus(STATUSES.loaded)

    if (interval.current) {
      clearInterval(interval.current)
    }
  }, [label])

  const onImageLoad = useCallback(() => {
    setDescriptor(undefined)

    interval.current = setInterval(async () => {
      if (!imageRef.current) return

      await detectFace()
      retries.current += 1

      if (interval.current && retries.current >= MAX_RETRIES) {
        clearInterval(interval.current)
      }
    }, 500)
  }, [detectFace])

  return useMemo(() => {
    return {
      /** The resulted face descriptor. A `null` value means the descriptor could not be determined. An `undefined` value means the descriptor was not computed yet. */
      descriptor,
      /**
       * Begins the computation of the descriptor. Should added as the callback for the `onLoad` image event.
       *
       * Eg. `<img onLoad={onImageLoad} />`
       */
      onImageLoad,
    }
  }, [descriptor, onImageLoad])
}
