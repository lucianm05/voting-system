import { CITIZEN_AUTH_STEPS } from '#shared/constants/citizens'
import { ROUTES } from '#shared/constants/routes'
import { attemptAuthenticationValidator } from '#validators/citizens'
import type { HttpContext } from '@adonisjs/core/http'

export default class CitizensController {
  async index({ inertia }: HttpContext) {
    return inertia.render(ROUTES.citizen.authentication.index.view, {
      step: CITIZEN_AUTH_STEPS.uploadID,
    })
  }

  async attemptAuthentication({ request, response, inertia }: HttpContext) {
    const { file } = await request.validateUsing(attemptAuthenticationValidator)
    console.log('file', file)

    return inertia.render(ROUTES.citizen.authentication.index.view, {
      step: CITIZEN_AUTH_STEPS.validation,
    })
  }
}
