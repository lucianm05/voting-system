import { ValueOf } from '#shared/types/index'

export const LIVENESS_CHALLENGES = {
  faceMatch: 'FACE_MATCH',
  headLeft: 'HEAD_LEFT',
  headRight: 'HEAD_RIGHT',
  openMouth: 'OPEN_MOUTH',
} as const

export type LivenessChallenge = ValueOf<typeof LIVENESS_CHALLENGES>
