import Admin from '#models/admin'
import { Routes } from '#shared/constants/routes'
import type { HttpContext } from '@adonisjs/core/http'

export default class AdminController {
  async renderIndex({ inertia }: HttpContext) {
    return inertia.render('admin/index')
  }

  async login({ request, response, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const admin = await Admin.verifyCredentials(email, password)

    await auth.use('web').login(admin)

    return response.redirect(Routes.admin.index.absolutePath)
  }

  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()

    return response.redirect(Routes.admin.login.absolutePath)
  }
}
