import Citizen from '#models/citizen'
import { LivenessChallenges } from '#shared/constants/liveness'
import { shuffle } from '#shared/functions/index'
import env from '#start/env'
import { Encryption } from '@adonisjs/core/encryption'
import { ModelAssignOptions } from '@adonisjs/lucid/types/model'
import { createHash } from 'node:crypto'

interface SaveLastVotePayload {
  citizen: Citizen
  electionId: string
  voteId: string
}

interface GetLastVotePayload {
  citizen: Citizen
  electionId: string
}

export default class CitizensService {
  private static encryption = new Encryption({
    secret: env.get('CITIZEN_LAST_VOTES_ENCRYPTION_SECRET'),
  })

  generateChallenges() {
    const nonFaceMatchChallenges = Object.values(LivenessChallenges).filter(
      (challenge) => challenge !== LivenessChallenges.faceMatch
    )
    const shuffledChallenges = shuffle(nonFaceMatchChallenges)
    const challenges = [LivenessChallenges.faceMatch, ...shuffledChallenges]

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

  private static encryptLastVotesMap(payload: Record<string, string>) {
    return this.encryption.encrypt(payload)
  }

  private static decryptLastVotesMap(citizen: Citizen): Record<string, string> | null {
    return this.encryption.decrypt(citizen.lastVotesMap)
  }

  static saveLastVoteId(payload: SaveLastVotePayload, options?: ModelAssignOptions) {
    const decryptedPayload = CitizensService.decryptLastVotesMap(payload.citizen)
    const lastVotesMap = CitizensService.encryptLastVotesMap({
      ...decryptedPayload,
      [payload.electionId]: payload.voteId,
    })

    return Citizen.updateOrCreate({ id: payload.citizen.id }, { lastVotesMap }, options)
  }

  static getLastVoteId(payload: GetLastVotePayload) {
    const decryptedPayload = CitizensService.decryptLastVotesMap(payload.citizen)
    if (!decryptedPayload) return null

    const voteId = decryptedPayload[payload.electionId]

    return voteId || null
  }
}
