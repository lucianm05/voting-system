import { LIVENESS_CHALLENGES } from '#shared/constants/liveness'
import { shuffle } from '#shared/functions/index'
import env from '#start/env'
import { createHash } from 'node:crypto'

export default class CitizensService {
  generateChallenges() {
    const nonFaceMatchChallenges = Object.values(LIVENESS_CHALLENGES).filter(
      (challenge) => challenge !== LIVENESS_CHALLENGES.faceMatch
    )
    const shuffledChallenges = shuffle(nonFaceMatchChallenges)
    const challenges = [LIVENESS_CHALLENGES.faceMatch, ...shuffledChallenges]

    return challenges
  }

  /**
   * Creates a deterministic "identity" for the user, which can be saved in the database and used to search for the citizen.
   */
  async createIdentity(cnp: string) {
    const identity = createHash('sha256')
      .update(`${env.get('APP_KEY')}_${cnp}`)
      .digest('hex')

    return identity
  }
}
