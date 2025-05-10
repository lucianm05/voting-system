import { RefObject, useCallback, useState } from 'react'
import { detectFaceWithLandmarks } from '~/app/features/liveness/functions'

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
    if (!videoRef.current) return
    const video = videoRef.current
    // const canvas = canvasRef.current

    // const dims = {
    //   width: video.videoWidth,
    //   height: video.videoHeight,
    // }

    // faceapi.matchDimensions(canvas, dims)
    const detections = await detectFaceWithLandmarks(video)

    // const ctx = canvas.getContext('2d')
    // if (!ctx) return
    // ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (detections?.landmarks) {
      // Get mouth landmarks (points 48-60)
      const mouth = detections.landmarks.getMouth()

      // Calculate the mouth aspect ratio (MAR)
      const topLip = mouth[2] // Point 51
      const bottomLip = mouth[8] // Point 57

      const lipHeight = Math.sqrt(
        Math.pow(bottomLip.x - topLip.x, 2) + Math.pow(bottomLip.y - topLip.y, 2)
      )

      // Calculate horizontal distance between the mouth corners
      const leftCorner = mouth[0] // Point 48
      const rightCorner = mouth[6] // Point 54

      const mouthWidth = Math.sqrt(
        Math.pow(rightCorner.x - leftCorner.x, 2) + Math.pow(rightCorner.y - leftCorner.y, 2)
      )

      // Calculate MAR (Mouth Aspect Ratio)
      const MAR = lipHeight / mouthWidth

      // Threshold for detecting mouth opening

      // Detect mouth opening
      if (MAR > OPEN_THRESHOLD) {
        setIsMouthOpen(true)
      } else {
        setIsMouthOpen(false)
      }

      // Draw face landmarks for debugging
      // ctx.strokeStyle = 'lime'
      // faceapi.draw.drawFaceLandmarks(canvas, faceapi.resizeResults(detections, dims))

      // ctx.fillStyle = 'lime'
      // ctx.font = '18px sans-serif'
      // ctx.fillText(status, 10, 20)
    } else {
      setIsMouthOpen(null)
      // ctx.fillStyle = 'red'
      // ctx.font = '18px sans-serif'
      // ctx.fillText('Face not detected', 10, 20)
    }
  }, [])

  return {
    detectMouth,
    isMouthOpen,
  }
}
