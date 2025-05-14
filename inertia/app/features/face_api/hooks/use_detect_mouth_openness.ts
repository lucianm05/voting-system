import { RefObject, useCallback, useState } from 'react'
import { detectFaceWithLandmarks } from '~/app/features/face_api/functions'

const OPEN_THRESHOLD = 0.8

interface Config {
  videoRef: RefObject<HTMLVideoElement | null>
}

/**
 * Based on the video stream, detects if the user opened their mouth.
 */
export function useDetectMouthOpenness({ videoRef }: Config) {
  const [isMouthOpen, setIsMouthOpen] = useState<boolean | null>(null)

  const detectMouth = useCallback(async () => {
    if (!videoRef.current) {
      setIsMouthOpen(null)
      return null
    }

    const detections = await detectFaceWithLandmarks(videoRef.current)

    if (!detections?.landmarks) {
      setIsMouthOpen(null)
      return null
    }

    // get mouth landmarks (points 48-60)
    const mouth = detections.landmarks.getMouth()

    // #region mouth aspect ratio
    const topLip = mouth[2] // Point 51
    const bottomLip = mouth[8] // Point 57
    const lipHeight = Math.sqrt(
      Math.pow(bottomLip.x - topLip.x, 2) + Math.pow(bottomLip.y - topLip.y, 2)
    )

    // horizontal distance between the mouth corners
    const leftCorner = mouth[0] // Point 48
    const rightCorner = mouth[6] // Point 54
    const mouthWidth = Math.sqrt(
      Math.pow(rightCorner.x - leftCorner.x, 2) + Math.pow(rightCorner.y - leftCorner.y, 2)
    )

    // Mouth Aspect Ratio
    const MAR = lipHeight / mouthWidth
    // #endregion

    // detect mouth opening
    const open = MAR > OPEN_THRESHOLD
    setIsMouthOpen(open)

    return open
  }, [])

  return {
    detectMouth,
    /**
     * Whether the mouth is open or closed. A `null` value means the mouth openness couldn't be determined.
     */
    isMouthOpen,
  }
}
