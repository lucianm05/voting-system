import { LIVENESS_CHALLENGES, LivenessChallenge } from '#shared/constants/liveness'
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDetectHeadMovement } from '~/app/features/face_api/hooks/use_detect_head_movement'
import { useDetectMouthOpenness } from '~/app/features/face_api/hooks/use_detect_mouth_openness'
import { useFaceMatch } from '~/app/features/face_api/hooks/use_face_match'
import { useFaceApiContext } from '~/app/features/face_api/providers'
import { useLogStatus } from '~/app/shared/hooks/use_log_status'

const NEEDED_PASSES = 3

interface Props {
  imageRef: RefObject<HTMLImageElement | null>
  videoRef: RefObject<HTMLVideoElement | null>
  challenges: LivenessChallenge[]
}

export function useAttemptChallenges({ imageRef, videoRef, challenges }: Props) {
  const [passed, setPassed] = useState({
    [LIVENESS_CHALLENGES.faceMatch]: false,
    [LIVENESS_CHALLENGES.headLeft]: false,
    [LIVENESS_CHALLENGES.headRight]: false,
    [LIVENESS_CHALLENGES.openMouth]: false,
  })
  const [currentChallenge, setCurrentChallenge] = useState<LivenessChallenge>(() => challenges[0])
  const [isStarted, setIsStarted] = useState(false)

  const headMovement = useDetectHeadMovement({ videoRef })
  const mouthOpenness = useDetectMouthOpenness({ videoRef })
  const faceMatch = useFaceMatch({ imageRef, videoRef })
  const { isLoaded } = useFaceApiContext()

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const passes = useRef(0)

  useLogStatus({
    name: 'useAttemptChallenges',
    status: currentChallenge || 'DONE',
    color: 'salmon',
  })

  const passedAllChallenges = useMemo(() => {
    return Object.values(passed).every(Boolean)
  }, [passed])

  const attemptChallenge = useCallback(async () => {
    if (!isLoaded || !isStarted) {
      return
    }

    console.log('attempting challenge', currentChallenge)

    switch (currentChallenge) {
      case LIVENESS_CHALLENGES.faceMatch: {
        const result = await faceMatch.verifyFace()
        return Boolean(result)
      }

      case LIVENESS_CHALLENGES.headLeft: {
        const result = await headMovement.detectHeadMovement()
        return result === 'LEFT'
      }

      case LIVENESS_CHALLENGES.headRight: {
        const result = await headMovement.detectHeadMovement()
        return result === 'RIGHT'
      }

      case LIVENESS_CHALLENGES.openMouth: {
        const result = await mouthOpenness.detectMouth()
        return Boolean(result)
      }
    }
  }, [
    isLoaded,
    isStarted,
    currentChallenge,
    faceMatch.verifyFace,
    headMovement.detectHeadMovement,
    mouthOpenness.detectMouth,
  ])

  const startChallenges = useCallback(() => {
    intervalRef.current = setInterval(async () => {
      if (passes.current >= NEEDED_PASSES) {
        setPassed((prev) => ({ ...prev, [currentChallenge]: true }))
        setCurrentChallenge((prev) => {
          const currIndex = challenges.indexOf(prev)
          return challenges[currIndex + 1]
        })

        passes.current = 0

        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }

        return
      }

      const passedChallenge = await attemptChallenge()

      if (passedChallenge) {
        passes.current += 1
      }
    }, 500)
  }, [attemptChallenge])

  const start = useCallback(() => {
    setIsStarted(true)
  }, [])

  useEffect(() => {
    if (isStarted && !passedAllChallenges) {
      startChallenges()
    }
  }, [isStarted, passedAllChallenges, startChallenges])

  return {
    passed,
    currentChallenge,
    start,
    onImageLoad: faceMatch.onImageLoad,
    isStarted,
  }
}
