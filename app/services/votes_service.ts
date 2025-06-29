import Candidate from '#models/candidate'
import Citizen from '#models/citizen'
import Vote from '#models/vote'
import CitizensService from '#services/citizens_service'
import ResultsService from '#services/results_service'
import env from '#start/env'
import { Encryption } from '@adonisjs/core/encryption'
import db from '@adonisjs/lucid/services/db'
import { ModelAssignOptions } from '@adonisjs/lucid/types/model'

interface VotePayload {
  candidateId: string
  createdAt?: Date
  revokedAt?: Date
}

interface RegisterVotePayload {
  citizen: Citizen
  candidateId: string
}

export default class VotesService {
  private static encryption = new Encryption({ secret: env.get('VOTING_ENCRYPTION_SECRET') })

  private static decryptVote(payload: string): VotePayload | null {
    const decrypted = VotesService.encryption.decrypt<VotePayload>(payload)

    if (!decrypted) return null

    return decrypted
  }

  private static encryptVote(payload: VotePayload) {
    return VotesService.encryption.encrypt(payload)
  }

  /**
   * Saves an encrypted vote.
   * @param candidateId
   * @returns
   */
  private static async saveVote(candidateId: string, options?: ModelAssignOptions) {
    const candidate = await Candidate.findOrFail(candidateId, options)

    if (!candidate.electionId)
      throw new Error(`Candidate ${candidateId} does not belong to any election.`)

    const encryptedPayload = VotesService.encryptVote({
      candidateId: candidate.id,
      createdAt: new Date(),
    })

    return Vote.create({ payload: encryptedPayload, electionId: candidate.electionId }, options)
  }

  private static async revokeVote(voteId: string, options?: ModelAssignOptions) {
    const vote = await Vote.findOrFail(voteId, options)

    const decryptedPayload = VotesService.decryptVote(vote.payload)
    if (!decryptedPayload) throw new Error(`Vote could not be decrypted.`)

    const newPayload = VotesService.encryptVote({ ...decryptedPayload, revokedAt: new Date() })

    return Vote.updateOrCreate({ id: voteId }, { payload: newPayload, revoked: true }, options)
  }

  /**
   * If the citizen didn't vote already, saves a new vote and increments the result for the given candidate. Otherwise, marks the existing vote as revoked, decrements the result for that candidated, saves a new vote and increments the result for the new candidate.
   */
  static async registerVote({ candidateId, citizen }: RegisterVotePayload) {
    const candidate = await Candidate.findOrFail(candidateId)

    const lastVoteId = CitizensService.getLastVoteId({
      citizen,
      electionId: candidate.electionId,
    })

    return db.transaction(async (transaction) => {
      console.log('lastVoteId', lastVoteId)
      if (lastVoteId) {
        await ResultsService.decrementVote(candidateId, { client: transaction })
        await VotesService.revokeVote(lastVoteId, { client: transaction })
      }

      const vote = await VotesService.saveVote(candidateId, { client: transaction })
      await ResultsService.incrementVote(candidateId, { client: transaction })
      await CitizensService.saveLastVoteId(
        {
          citizen,
          electionId: candidate.electionId,
          voteId: vote.id,
        },
        { client: transaction }
      )

      return vote
    })
  }
}
