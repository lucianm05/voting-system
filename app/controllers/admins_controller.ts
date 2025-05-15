import Admin from '#models/admin'
import { ROUTES } from '#shared/constants/routes'
import type { HttpContext } from '@adonisjs/core/http'

export default class AdminController {
  async index({ inertia }: HttpContext) {
    return inertia.render('admin/index')
  }

  async login({ request, response, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const admin = await Admin.verifyCredentials(email, password)

    await auth.use('web').login(admin)

    return response.redirect(ROUTES.admin.index.absolutePath)
  }

  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()

    return response.redirect(ROUTES.admin.login.absolutePath)
  }
}
