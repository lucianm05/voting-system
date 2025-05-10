import * as faceapi from 'face-api.js'
import { useEffect, useRef, useState } from 'react'

export default function CitizenAuthenticationValidate() {
  const [status, setStatus] = useState('Initializing...')
  const [mouthOpen, setIsMouthOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/face_api_models'
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
      ])
      startVideo()
    }

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current!.play()
            resizeCanvas()
          }
        }
      })
    }

    const resizeCanvas = () => {
      if (!videoRef.current || !canvasRef.current) return
      const video = videoRef.current
      const canvas = canvasRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
    }

    const detectHeadMovement = async () => {
      if (!videoRef.current || !canvasRef.current) return
      const video = videoRef.current
      const canvas = canvasRef.current

      const dims = {
        width: video.videoWidth,
        height: video.videoHeight,
      }

      faceapi.matchDimensions(canvas, dims)
      const detections = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.2 })
        )
        .withFaceLandmarks(true)

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (detections?.landmarks) {
        const leftEye = detections.landmarks.getLeftEye()
        const rightEye = detections.landmarks.getRightEye()
        const dx = rightEye[0].x - leftEye[0].x
        const dy = rightEye[0].y - leftEye[0].y
        const angle = Math.atan2(dy, dx) * (180 / Math.PI)

        ctx.strokeStyle = 'lime'
        faceapi.draw.drawFaceLandmarks(canvas, faceapi.resizeResults(detections, dims))

        ctx.fillStyle = 'lime'
        ctx.font = '18px sans-serif'
        if (angle < -5) {
          setStatus('Head turned LEFT')
          ctx.fillText('Head turned LEFT', 10, 20)
        } else if (angle > 5) {
          setStatus('Head turned RIGHT')
          ctx.fillText('Head turned RIGHT', 10, 20)
        } else {
          setStatus('Looking FORWARD')
          ctx.fillText('Looking FORWARD', 10, 20)
        }
      } else {
        setStatus('Face not detected')
        ctx.fillStyle = 'red'
        ctx.font = '18px sans-serif'
        ctx.fillText('Face not detected', 10, 20)
      }
    }

    const detectMouthOpen = async () => {
      if (!videoRef.current || !canvasRef.current) return
      const video = videoRef.current
      const canvas = canvasRef.current

      const dims = {
        width: video.videoWidth,
        height: video.videoHeight,
      }

      faceapi.matchDimensions(canvas, dims)
      const detections = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.2 })
        )
        .withFaceLandmarks(true)

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

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
        const OPEN_THRESHOLD = 0.8 // Adjust based on testing

        // Detect mouth opening
        if (MAR > OPEN_THRESHOLD) {
          setIsMouthOpen(true)
          setStatus('Mouth Open')
        } else {
          setIsMouthOpen(false)
          setStatus('Mouth Closed')
        }

        // Draw face landmarks for debugging
        ctx.strokeStyle = 'lime'
        faceapi.draw.drawFaceLandmarks(canvas, faceapi.resizeResults(detections, dims))

        ctx.fillStyle = 'lime'
        ctx.font = '18px sans-serif'
        ctx.fillText(status, 10, 20)
      } else {
        setStatus('Face not detected')
        ctx.fillStyle = 'red'
        ctx.font = '18px sans-serif'
        ctx.fillText('Face not detected', 10, 20)
      }
    }

    loadModels()
    const interval = setInterval(() => {
      // detectHeadMovement()
      detectMouthOpen()
    }, 300)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    console.log('mouthOpen', mouthOpen)
  }, [mouthOpen])

  return (
    <main className="relative w-full h-screen flex justify-center items-center bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="absolute bottom-4 left-4 text-white font-bold bg-black/60 p-2 rounded">
        {status}
      </div>
    </main>
  )
}
