import Candidate from '#models/candidate'
import Result from '#models/result'
import { WithTransaction } from '../types.js'

export default class ResultsService {
  static async findByCandidateIdOrCreate(candidateId: string, options?: WithTransaction) {
    const result = await Result.findBy({ candidateId }, options)
    if (result) return result

    const candidate = await Candidate.findOrFail(candidateId, options)

    return Result.create(
      {
        candidateId: candidate.id,
        electionId: candidate.electionId,
        votes: 0,
      },
      options
    )
  }

  static async incrementVote(candidateId: string, options?: WithTransaction) {
    const result = await ResultsService.findByCandidateIdOrCreate(candidateId, options)
    const votes = result.votes + 1

    return Result.updateOrCreate({ id: result.id }, { votes }, options)
  }

  static async decrementVote(candidateId: string, options?: WithTransaction) {
    const result = await ResultsService.findByCandidateIdOrCreate(candidateId, options)
    let votes = result.votes
    if (votes > 0) {
      votes = votes - 1
    }

    return Result.updateOrCreate({ id: result.id }, { votes }, options)
  }
}
