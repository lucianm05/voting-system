import Citizen from '#models/citizen'
import CitizensService from '#services/citizens_service'
import { CITIZEN_AUTH_STEPS } from '#shared/constants/citizens'
import { ROUTES } from '#shared/constants/routes'
import { attemptAuthenticationValidator } from '#validators/citizens'
import type { HttpContext } from '@adonisjs/core/http'

export default class CitizensController {
  service: CitizensService

  constructor() {
    this.service = new CitizensService()
  }

  async index({ inertia }: HttpContext) {
    return inertia.render(ROUTES.citizen.authentication.index.view, {
      step: CITIZEN_AUTH_STEPS.uploadID,
    })
  }

  async attemptAuthentication({ request, inertia, session }: HttpContext) {
    const { file } = await request.validateUsing(attemptAuthenticationValidator)
    // console.log('file', file)
    const cnp = '5010405295915'

    const challenges = this.service.generateChallenges()

    session.put('cnp', cnp)

    return inertia.render(ROUTES.citizen.authentication.index.view, {
      step: CITIZEN_AUTH_STEPS.validation,
      challenges,
    })
  }

  async login({ session, auth, response }: HttpContext) {
    const cnp = session.get('cnp')
    const identity = await this.service.createIdentity(cnp)
    const citizen = await Citizen.firstOrCreate({ identity })
    await auth.use('citizen').login(citizen)

    return response.redirect(ROUTES.citizen.elections.absolutePath)
  }
}
