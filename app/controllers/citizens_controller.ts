import Citizen from '#models/citizen'
import CitizensService from '#services/citizens_service'
import DocumentAIService from '#services/document_ai_service'
import { CitizenAuthSteps } from '#shared/constants/citizens'
import { Routes } from '#shared/constants/routes'
import { attemptAuthenticationValidator, identityCardValidator } from '#validators/citizens'
import type { HttpContext } from '@adonisjs/core/http'

export default class CitizensController {
  async renderIndex({ inertia, session }: HttpContext) {
    const citizenData = await CitizensService.sessionData.pullAll(session) // pull the session data to avoid blocking the user in the validation step

    // if we have citizen data, it means the user already passed the "upload ci" step, so they need to validate their identity
    if (citizenData) {
      CitizensService.sessionData.setCNP(session, citizenData.cnp)
      CitizensService.sessionData.setAddress(session, citizenData.address)

      const challenges = CitizensService.generateChallenges()

      return inertia.render(Routes.citizen.authentication.index.view, {
        step: CitizenAuthSteps.validation,
        challenges,
      })
    }

    return inertia.render(Routes.citizen.authentication.index.view, {
      step: CitizenAuthSteps.uploadID,
    })
  }

  async attemptIdentityCardValidation({ request, inertia, session }: HttpContext) {
    const { file } = await request.validateUsing(attemptAuthenticationValidator)
    const ocrData = await DocumentAIService.extractOCRData(file)
    const validatedData = await identityCardValidator.validate(ocrData)

    CitizensService.sessionData.setAll(session, validatedData)

    return inertia.render(Routes.citizen.authentication.index.view, {
      step: CitizenAuthSteps.uploadID,
      ocrData: validatedData,
    })
  }

  async login({ session, auth, response }: HttpContext) {
    const cnp = await CitizensService.sessionData.pullCNP(session)

    if (!cnp) {
      return response.redirect(Routes.citizen.authentication.index.absolutePath)
    }

    const identity = await CitizensService.createIdentity(cnp)
    const citizen = await Citizen.firstOrCreate({ identity })
    await auth.use('citizen').login(citizen)

    return response.redirect(Routes.citizen.elections.index.absolutePath)
  }
}
