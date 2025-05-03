import Candidate from '#models/candidate'
import Election from '#models/election'
import { ROUTES } from '#shared/constants/routes'
import { createCandidateValidator } from '#validators/candidate'
import type { HttpContext } from '@adonisjs/core/http'

export default class CandidatesController {
  /**
   * Display a list of resource
   */
  async index({ inertia }: HttpContext) {
    const elections = await Election.query().orderBy('createdAt', 'asc')

    return inertia.render(ROUTES.admin.candidates.index.view, { elections })
  }

  async createIndex({ inertia }: HttpContext) {
    const elections = await Election.query().orderBy('createdAt', 'asc')

    return inertia.render(ROUTES.admin.candidates.create.index.view, { elections })
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
