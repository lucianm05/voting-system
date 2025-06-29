import Candidate from '#models/candidate'
import Result from '#models/result'
import { ModelAssignOptions } from '@adonisjs/lucid/types/model'

export default class ResultsService {
  static async findByCandidateIdOrCreate(candidateId: string, options?: ModelAssignOptions) {
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

  static async incrementVote(candidateId: string, options?: ModelAssignOptions) {
    const result = await ResultsService.findByCandidateIdOrCreate(candidateId, options)

    const votes = result.votes + 1

    return Result.updateOrCreate({ id: result.id }, { votes }, options)
  }

  static async decrementVote(candidateId: string, options?: ModelAssignOptions) {
    const result = await ResultsService.findByCandidateIdOrCreate(candidateId, options)

    console.log('initialVotes', result.votes)
    let votes = result.votes
    if (votes > 0) {
      votes = votes - 1
    }
    console.log('currentVotes', votes)

    return Result.updateOrCreate({ id: result.id }, { votes }, options)
  }
}
