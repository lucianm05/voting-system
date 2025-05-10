import { ROUTES } from '#shared/constants/routes'
import { attemptAuthenticationValidator } from '#validators/citizens'
import type { HttpContext } from '@adonisjs/core/http'

export default class CitizensController {
  async attemptAuthentication({ request, response }: HttpContext) {
    console.log('attempting authentication')
    const { file } = await request.validateUsing(attemptAuthenticationValidator)
    console.log('file', file)

    // try {
    //   const imageProcessingService = new ImageProcessingService(file)
    //   const ocrData = await imageProcessingService.OCR()
    //   console.log('ocrData', ocrData)
    // } catch (err) {
    //   console.log(err)
    // }

    return response.redirect(ROUTES.citizen.authentication.validate.absolutePath)
  }
}
