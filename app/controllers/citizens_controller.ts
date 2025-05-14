import { CITIZEN_AUTH_STEPS } from '#shared/constants/citizens'
import { LIVENESS_CHALLENGES } from '#shared/constants/liveness'
import { ROUTES } from '#shared/constants/routes'
import { shuffle } from '#shared/functions/index'
import { attemptAuthenticationValidator } from '#validators/citizens'
import type { HttpContext } from '@adonisjs/core/http'

export default class CitizensController {
  async index({ inertia }: HttpContext) {
    return inertia.render(ROUTES.citizen.authentication.index.view, {
      step: CITIZEN_AUTH_STEPS.uploadID,
    })
  }

  async attemptAuthentication({ request, inertia }: HttpContext) {
    const { file } = await request.validateUsing(attemptAuthenticationValidator)
    console.log('file', file)
    const nonFaceMatchChallenges = Object.values(LIVENESS_CHALLENGES).filter(
      (challenge) => challenge !== LIVENESS_CHALLENGES.faceMatch
    )
    const shuffledChallenges = shuffle(nonFaceMatchChallenges)
    const challenges = [LIVENESS_CHALLENGES.faceMatch, ...shuffledChallenges]

    return inertia.render(ROUTES.citizen.authentication.index.view, {
      step: CITIZEN_AUTH_STEPS.validation,
      challenges,
    })
  }
}
