import Candidate from '#models/candidate'
import Election from '#models/election'
import UATService from '#services/uats_service'
import { Routes } from '#shared/constants/routes'
import { createCandidateValidator, getCandidatesValidator } from '#validators/candidates'
import type { HttpContext } from '@adonisjs/core/http'

export default class CandidatesController {
  /**
   * Display a list of resource
   */
  async renderAdminIndex({ request, inertia }: HttpContext) {
    const { electionId } = await request.validateUsing(getCandidatesValidator)

    return inertia.render(Routes.admin.candidates.index.view, {
      elections: () => {
        return Election.query().orderBy('createdAt', 'asc')
      },
      candidates: () => {
        if (!electionId) return []
        return Candidate.query()
          .where('electionId', electionId)
          .orderBy('county', 'asc')
          .orderBy('locality', 'asc')
          .orderBy('name', 'asc')
      },
    })
  }

  async renderCreate({ request, inertia }: HttpContext) {
    return inertia.render(Routes.admin.candidates.create.view, {
      elections: () => Election.query().orderBy('createdAt', 'asc'),
      counties: inertia.optional(() => {
        return UATService.getCounties()
      }),
      localities: inertia.optional(() => {
        const { autoCode } = request.only(['autoCode'])
        return UATService.getLocalitiesForElectionsByAutoCode(autoCode)
      }),
    })
  }

  async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createCandidateValidator)
    const election = await Election.findOrFail(payload.electionId)

    const candidate = await Candidate.create({
      name: payload.name,
      type: payload.type,
      electionId: payload.electionId,
      county: payload.county,
      locality: payload.locality,
    })

    await candidate.related('election').associate(election)

    return response.redirect().toPath(request.url(true))
  }
}
