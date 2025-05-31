import Candidate from '#models/candidate'
import Election from '#models/election'
import { Routes } from '#shared/constants/routes'
import { createVoteValidator } from '#validators/votes'
import { type HttpContext } from '@adonisjs/core/http'

export default class VotesController {
  async renderVote({ params, response, inertia }: HttpContext) {
    const { id } = params

    const election = await Election.findBy({ id })

    if (!election) {
      return response.notFound()
    }

    const candidates = await Candidate.findManyBy({ electionId: id })

    return inertia.render(Routes.citizen.elections.vote.view, { election, candidates })
  }

  async vote({ request, response }: HttpContext) {
    const { candidateId, electionId } = await request.validateUsing(createVoteValidator)

    console.log(`registering vote in election ${electionId} for candidate ${candidateId}`)

    return response.redirect(Routes.citizen.elections.index.absolutePath)
  }
}
