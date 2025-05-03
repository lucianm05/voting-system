import Election from '#models/election'
import { ROUTES } from '#shared/constants/routes'
import { createElectionValidator } from '#validators/election'
import type { HttpContext } from '@adonisjs/core/http'

export default class ElectionController {
  /**
   * Display a list of resource
   */
  async index({ inertia }: HttpContext) {
    const elections = await Election.query().orderBy('createdAt', 'asc')

    return inertia.render(ROUTES.admin.elections.index.view, { elections })
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createElectionValidator)
    await Election.create({
      name: payload.name,
      description: payload.description,
      dateStart: payload.dateStart,
      dateEnd: payload.dateEnd,
    })

    return response.redirect().toRoute(ROUTES.admin.elections.index.absolutePath)
  }

  // /**
  //  * Show individual record
  //  */
  // async show({ params }: HttpContext) {}

  // /**
  //  * Edit individual record
  //  */
  // async edit({ params }: HttpContext) {}

  // /**
  //  * Handle form submission for the edit action
  //  */
  // async update({ params, request }: HttpContext) {}

  // /**
  //  * Delete record
  //  */
  // async destroy({ params }: HttpContext) {}
}
