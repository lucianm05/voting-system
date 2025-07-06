import Candidate from '#models/candidate'
import Citizen from '#models/citizen'
import Vote from '#models/vote'
import VoteVerificationAttempt from '#models/vote_verification_attempt'
import CitizensService from '#services/citizens_service'
import ResultsService from '#services/results_service'
import { toUTC } from '#shared/functions/dates'
import env from '#start/env'
import { Encryption } from '@adonisjs/core/encryption'
import db from '@adonisjs/lucid/services/db'
import { WithTransaction } from '../types.js'

interface VotePayload {
  candidateId: string
  createdAt?: Date
  revokedAt?: Date
}

interface RegisterVotePayload {
  citizen: Citizen
  candidate: Candidate
}

interface VerifyVotePayload {
  citizen: Citizen
  electionId: string
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
  private static async createVote(candidateId: string, options?: WithTransaction) {
    const candidate = await Candidate.findOrFail(candidateId, options)

    if (!candidate.electionId)
      throw new Error(`Candidate ${candidateId} does not belong to any election.`)

    const encryptedPayload = VotesService.encryptVote({
      candidateId: candidate.id,
      createdAt: new Date(),
    })

    return Vote.create({ payload: encryptedPayload, electionId: candidate.electionId }, options)
  }

  private static async revokeVote(voteId: string, options?: WithTransaction) {
    const vote = await Vote.find(voteId, options)
    if (!vote) return null

    const decryptedPayload = VotesService.decryptVote(vote.payload)
    if (!decryptedPayload) throw new Error(`Vote could not be decrypted.`)

    const newPayload = VotesService.encryptVote({ ...decryptedPayload, revokedAt: new Date() })

    return Vote.updateOrCreate({ id: voteId }, { payload: newPayload, revoked: true }, options)
  }

  private static async getVotedCandidateId(voteId: string, options?: WithTransaction) {
    const vote = await Vote.find(voteId, options)
    if (!vote) return null

    const decryptedPayload = VotesService.decryptVote(vote.payload)
    if (!decryptedPayload) throw new Error(`Vote could not be decrypted.`)

    return decryptedPayload.candidateId
  }

  /**
   * If the citizen didn't vote already, saves a new vote and increments the result for the given candidate. Otherwise, marks the existing vote as revoked, decrements the result for that candidated, saves a new vote and increments the result for the new candidate.
   */
  static async registerVote({ candidate, citizen }: RegisterVotePayload) {
    const lastVoteId = CitizensService.getLastVoteId({
      citizen,
      electionId: candidate.electionId,
    })

    return db.transaction(async (transaction) => {
      if (lastVoteId) {
        const votedCandidate = await VotesService.getVotedCandidateId(lastVoteId, {
          client: transaction,
        })
        if (votedCandidate) {
          await ResultsService.decrementVote(votedCandidate, { client: transaction })
          await VotesService.revokeVote(lastVoteId, { client: transaction })
        }
      }

      const vote = await VotesService.createVote(candidate.id, { client: transaction })
      await ResultsService.incrementVote(candidate.id, { client: transaction })
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

  static async canVerifyVote({ citizen, electionId }: VerifyVotePayload) {
    // if there's not vote, let the user see the verification screen, where they'll be prompted with "no vote registered"
    const lastVoteId = CitizensService.getLastVoteId({ citizen, electionId })
    if (!lastVoteId) return true

    const vote = await Vote.find(lastVoteId)
    if (!vote) return true

    const votePayload = VotesService.decryptVote(vote.payload)
    if (!votePayload) return true

    // if we have a vote, limit the attempts to 3 maximum and 30 mins since the vote was registered
    const attempts = await VoteVerificationAttempt.findManyBy({ voteId: lastVoteId })

    const currentDate = toUTC(undefined)
    const voteCreatedAt = toUTC(votePayload.createdAt)
    const diff = currentDate.diff(voteCreatedAt, 'minutes')

    return diff < 30 && attempts.length < 3
  }

  static async verifyVote({ citizen, electionId }: VerifyVotePayload) {
    return db.transaction(async (transaction) => {
      const lastVoteId = CitizensService.getLastVoteId({ citizen, electionId })
      if (!lastVoteId) return null

      const candidateId = await VotesService.getVotedCandidateId(lastVoteId, {
        client: transaction,
      })
      const candidate = await Candidate.findOrFail(candidateId, { client: transaction })

      await VoteVerificationAttempt.create({ voteId: lastVoteId })

      return candidate
    })
  }
}
