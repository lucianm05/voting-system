import { useEffect } from 'react'
import { useCitizenAuthenticationContext } from '~/app/features/citizen/authentication/providers'
import { useFaceMatch } from '~/app/features/face_api/hooks/use_face_match'
import { useFaceApiContext } from '~/app/features/face_api/providers'
import { useLocalFileURL } from '~/app/hooks/use_local_file_url'

export function CitizenAuthenticationValidation() {
  const { form } = useCitizenAuthenticationContext()
  const { imageRef, videoRef, isLoaded } = useFaceApiContext()
  const faceMatch = useFaceMatch({ videoRef, imageRef })
  const imageUrl = useLocalFileURL({ file: form.data.file })

  useEffect(() => {
    function startProcess() {
      if (!isLoaded) {
        return
      }

      startVideo()
    }

    function startVideo() {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current!.play()
          }
        }
      })
    }

    startProcess()

    const interval = setInterval(() => {
      if (!isLoaded) {
        return
      }

      faceMatch.verifyFace().then((result) => {
        console.log('isMatching', result)
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [isLoaded, faceMatch.verifyFace])

  return (
    <div className="grid grid-cols-[12.5rem,auto]">
      {imageUrl && (
        <img
          ref={imageRef}
          src={imageUrl}
          className="sr-only"
          onLoad={faceMatch.onImageLoad}
          aria-hidden
        />
      )}

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        width={480}
        height={480}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover rounded-full aspect-square shadow-lg"
      />
    </div>
  )
}
