import { ValueOf } from '#shared/types/index'
import * as faceapi from 'face-api.js'
import { RefObject, useCallback, useState } from 'react'
import { useDetectFaceInImage } from '~/app/features/face_api/hooks/use_detect_face_in_image'
import { useLogStatus } from '~/app/hooks/use_log_status'

const LABEL = 'citizen'

const STATUSES = {
  videoRefMissing: 'VIDEO_REF_MISSING',
  noDescriptor: 'NO_DESCRIPTOR',
  noFaceDetected: 'NO_FACE_DETECTED',
  findingMatch: 'FINDING_MATCH',
} as const

interface Config {
  /**
   * Ref of the video stream.
   */
  videoRef: RefObject<HTMLVideoElement | null>
  /**
   * Ref of the image to compare against the video stream.
   */
  imageRef: RefObject<HTMLImageElement | null>
}

export function useFaceMatch({ videoRef, imageRef }: Config) {
  const [isMatching, setIsMatching] = useState<boolean | null>(null)
  const [status, setStatus] = useState<ValueOf<typeof STATUSES> | null>(null)
  const { descriptor, onImageLoad } = useDetectFaceInImage({ imageRef, label: LABEL })

  useLogStatus({ name: 'useFaceMatch', color: 'lime', status })

  const verifyFace = useCallback(async () => {
    if (!videoRef.current) {
      setIsMatching(null)
      setStatus(STATUSES.videoRefMissing)
      return null
    }

    if (!descriptor) {
      setIsMatching(null)
      setStatus(STATUSES.noDescriptor)
      return null
    }

    const detection = await faceapi
      .detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor()

    if (!detection) {
      setIsMatching(null)
      setStatus(STATUSES.noFaceDetected)
      return null
    }

    setStatus(STATUSES.findingMatch)

    const faceMatcher = new faceapi.FaceMatcher(descriptor, 0.6)
    const bestMatch = faceMatcher.findBestMatch(detection.descriptor)
    const result = bestMatch.label === LABEL && bestMatch.distance < 0.6

    setIsMatching(result)

    return result
  }, [descriptor])

  return {
    /**
     * Whether the face from the video stream is matching with the image. A `null` value means the faces could not be verified.
     */
    isMatching,
    onImageLoad,
    verifyFace,
  }
}
