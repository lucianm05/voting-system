import { RefObject, useCallback, useState } from 'react'
import { detectFaceWithLandmarks } from '~/app/features/face_api/functions'
import { ValueOf } from '~/app/types'

const RIGHT_THRESHOLD = 5
const LEFT_THRESHOLD = -5

export const HEAD_POSITIONS = {
  forward: 'FORWARD',
  left: 'LEFT',
  right: 'RIGHT',
} as const

type HeadPosition = ValueOf<typeof HEAD_POSITIONS>

interface Config {
  videoRef: RefObject<HTMLVideoElement | null>
}

/**
 * Based on the video stream, detects the movement of the user's head.
 */
export function useDetectHeadMovement({ videoRef }: Config) {
  const [headPosition, setHeadPosition] = useState<HeadPosition | null>(null)

  const detectHeadMovement = useCallback(async () => {
    if (!videoRef.current) return

    const video = videoRef.current
    const detections = await detectFaceWithLandmarks(video)

    if (!detections?.landmarks) {
      setHeadPosition(null)
      return
    }

    const leftEye = detections.landmarks.getLeftEye()
    const rightEye = detections.landmarks.getRightEye()
    const dx = rightEye[0].x - leftEye[0].x
    const dy = rightEye[0].y - leftEye[0].y
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)

    if (angle < LEFT_THRESHOLD) {
      setHeadPosition(HEAD_POSITIONS.left)
      return
    }

    if (angle > RIGHT_THRESHOLD) {
      setHeadPosition(HEAD_POSITIONS.right)
      return
    }

    setHeadPosition(HEAD_POSITIONS.forward)
  }, [])

  return {
    detectHeadMovement,
    /**
     * The current head position of the user. A `null` value means the head movement could not be determined.
     */
    headPosition,
  }
}
