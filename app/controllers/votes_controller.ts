import Candidate from '#models/candidate'
import CandidatesService from '#services/candidates_service'
import CitizensService from '#services/citizens_service'
import VotesService from '#services/votes_service'
import { Routes } from '#shared/constants/routes'
import { createVoteValidator } from '#validators/votes'
import { type HttpContext } from '@adonisjs/core/http'

export default class VotesController {
  async create({ request, response, session, auth }: HttpContext) {
    const { candidateId } = await request.validateUsing(createVoteValidator)

    const citizen = auth.use('citizen').getUserOrFail()
    const citizenLocation = await CitizensService.sessionData.getLocation(session)

    const candidate = await Candidate.findOrFail(candidateId)
    const canVote = await CandidatesService.canVoteForCandidate({ candidate, citizenLocation })

    if (!canVote) {
      return response.forbidden()
    }

    await VotesService.registerVote({ candidate, citizen })

    return response.redirect(Routes.citizen.elections.index.absolutePath)
  }
}
