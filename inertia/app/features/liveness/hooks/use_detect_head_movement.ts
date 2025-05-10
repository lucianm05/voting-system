import { RefObject, useCallback, useState } from 'react'
import { detectFaceWithLandmarks } from '~/app/features/liveness/functions'
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
      const leftEye = detections.landmarks.getLeftEye()
      const rightEye = detections.landmarks.getRightEye()
      const dx = rightEye[0].x - leftEye[0].x
      const dy = rightEye[0].y - leftEye[0].y
      const angle = Math.atan2(dy, dx) * (180 / Math.PI)

      // ctx.strokeStyle = 'lime'
      // faceapi.draw.drawFaceLandmarks(canvas, faceapi.resizeResults(detections, dims))

      // ctx.fillStyle = 'lime'
      // ctx.font = '18px sans-serif'
      if (angle < LEFT_THRESHOLD) {
        // setStatus('Head turned LEFT')
        setHeadPosition(HEAD_POSITIONS.left)
        // ctx.fillText('Head turned LEFT', 10, 20)
      } else if (angle > RIGHT_THRESHOLD) {
        // setStatus('Head turned RIGHT')
        setHeadPosition(HEAD_POSITIONS.right)
        // ctx.fillText('Head turned RIGHT', 10, 20)
      } else {
        // setStatus('Looking FORWARD')
        setHeadPosition(HEAD_POSITIONS.forward)
        // ctx.fillText('Looking FORWARD', 10, 20)
      }
    } else {
      // setStatus('Face not detected')
      setHeadPosition(null)
      // ctx.fillStyle = 'red'
      // ctx.font = '18px sans-serif'
      // ctx.fillText('Face not detected', 10, 20)
    }
  }, [])

  return {
    detectHeadMovement,
    headPosition,
  }
}
