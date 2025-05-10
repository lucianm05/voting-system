import Admin from '#models/admin'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  /**
   * Handle form submission for the create action
   */
  async store({ request, response, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const admin = await Admin.verifyCredentials(email, password)

    await auth.use('web').login(admin)

    return response.redirect('admin')
  }

  /**
   * Delete record
   */
  async destroy({ response, auth }: HttpContext) {
    await auth.use('web').logout()

    return response.redirect('admin/login')
  }
}
