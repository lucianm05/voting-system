import { Routes } from '#shared/constants/routes'
import { usePage } from '@inertiajs/react'
import { Title } from '@mantine/core'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useCitizenAuthenticationContext } from '~/app/features/citizen/authentication/providers'
import { Props } from '~/app/features/citizen/authentication/types'
import { InstructionsCard } from '~/app/features/citizen/authentication/validation/components/instructions-card'
import { useAttemptChallenges } from '~/app/features/face_api/hooks/use_attempt_challenges'
import { useFaceApiContext } from '~/app/features/face_api/providers'
import { cn } from '~/app/shared/functions'
import { useLocalFileURL } from '~/app/shared/hooks/use_local_file_url'

export function CitizenAuthenticationValidation() {
  const { t } = useTranslation()
  const { form } = useCitizenAuthenticationContext()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const { challenges } = usePage<Props>().props

  const { isLoaded } = useFaceApiContext()
  const { currentChallenge, passedAllChallenges, start, onImageLoad, isStarted } =
    useAttemptChallenges({
      imageRef,
      videoRef,
      challenges: challenges || [],
    })

  const imageUrl = useLocalFileURL({ file: form.data.file })

  useEffect(() => {
    function startVideo() {
      return new Promise((resolve) => {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            videoRef.current.onloadedmetadata = () => {
              videoRef.current!.play()
              resolve(true)
            }
          }
        })
      })
    }

    async function startProcess() {
      if (!isLoaded || !isLoaded) {
        return
      }

      await startVideo()
    }

    startProcess()
  }, [isLoaded, isStarted])

  useEffect(() => {
    if (!passedAllChallenges) {
      return
    }

    function stopTracks() {
      const mediaStream = videoRef.current?.srcObject

      if (mediaStream instanceof MediaStream) {
        const tracks = mediaStream.getTracks()
        tracks.forEach((track) => track.stop())
      }
    }

    function loginCitizen() {
      form.post(Routes.citizen.authentication.login.absolutePath, {
        onSuccess: () => {
          stopTracks()
        },
      })
    }

    const timeout = setTimeout(() => {
      loginCitizen()
    }, 2500)

    return () => {
      clearTimeout(timeout)
    }
  }, [passedAllChallenges])

  return (
    <>
      {imageUrl && (
        <img ref={imageRef} src={imageUrl} className="sr-only" onLoad={onImageLoad} aria-hidden />
      )}

      <div
        className={cn(
          'py-8 flex flex-col space-y-4 min-h-screen items-center',
          isStarted ? 'justify-between' : 'justify-center'
        )}
      >
        {!isStarted && <InstructionsCard onStart={start} />}

        {isStarted && (
          <>
            <Title order={1}>
              {currentChallenge
                ? t(`citizen.authentication.liveness_challenges.${currentChallenge.toLowerCase()}`)
                : t('citizen.authentication.liveness_challenges.done')}
            </Title>

            <div className="aspect-square shadow-lg w-[calc(100%-2rem)] h-auto max-w-[30rem] max-h-[30rem] rounded-full overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                width={480}
                height={480}
                className="object-cover w-full h-full"
                style={{ transform: 'scale(-1,1)' }}
              />
            </div>

            <div></div>
          </>
        )}
      </div>
    </>
  )
}
