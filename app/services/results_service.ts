import Candidate from '#models/candidate'
import Result from '#models/result'
import { ModelAssignOptions } from '@adonisjs/lucid/types/model'

export default class ResultsService {
  static async findByCandidateIdOrCreate(candidateId: string, options?: ModelAssignOptions) {
    const result = await Result.find(candidateId, options)

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

  static async incrementVote(candidateId: string, options?: ModelAssignOptions) {
    const result = await ResultsService.findByCandidateIdOrCreate(candidateId, options)

    const votes = result.votes + 1

    return Result.updateOrCreate({ candidateId }, { votes }, options)
  }

  static async decrementVote(candidateId: string, options?: ModelAssignOptions) {
    const result = await ResultsService.findByCandidateIdOrCreate(candidateId)

    let votes = result.votes
    if (result.votes > 0) {
      votes = result.votes - 1
    }

    return Result.updateOrCreate({ candidateId }, { votes }, options)
  }
}
