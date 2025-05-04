import Candidate from '#models/candidate'
import Election from '#models/election'
import { ROUTES } from '#shared/constants/routes'
import { createCandidateValidator, getCandidatesValidator } from '#validators/candidate'
import type { HttpContext } from '@adonisjs/core/http'

export default class CandidatesController {
  /**
   * Display a list of resource
   */
  async index({ request, inertia }: HttpContext) {
    const { electionId } = await request.validateUsing(getCandidatesValidator)

    return inertia.render(ROUTES.admin.candidates.index.view, {
      elections: () => {
        return Election.query().orderBy('createdAt', 'asc')
      },
      candidates: () => {
        if (!electionId) return []
        return Candidate.query().where('electionId', electionId)
      },
    })
  }

  async createIndex({ inertia }: HttpContext) {
    return inertia.render(ROUTES.admin.candidates.create.index.view, {
      elections: () => Election.query().orderBy('createdAt', 'asc'),
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createCandidateValidator)
    const election = await Election.findOrFail(payload.electionId)
    const candidate = await Candidate.create({
      name: payload.name,
      type: payload.type,
    })

    await candidate.related('election').associate(election)

    return response.redirect().toRoute(ROUTES.admin.candidates.create.index.absolutePath)
  }
}
