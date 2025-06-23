import Election from '#models/election'
import { Routes } from '#shared/constants/routes'
import { createElectionValidator } from '#validators/elections'
import type { HttpContext } from '@adonisjs/core/http'

export default class ElectionController {
  async renderAdminIndex({ inertia }: HttpContext) {
    const elections = await Election.query().orderBy('createdAt', 'asc')

    return inertia.render(Routes.admin.elections.index.view, { elections })
  }

  async renderCitizensIndex({ inertia }: HttpContext) {
    const elections = await Election.query().orderBy('createdAt', 'asc')

    return inertia.render(Routes.citizen.elections.index.view, { elections })
  }

  /**
   * Handle form submission for the create action
   */
  async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createElectionValidator)
    await Election.create({
      name: payload.name,
      description: payload.description,
      electionType: payload.electionType,
      dateStart: payload.dateStart,
      dateEnd: payload.dateEnd,
    })

    return response.redirect().toRoute(Routes.admin.elections.index.absolutePath)
  }
}
