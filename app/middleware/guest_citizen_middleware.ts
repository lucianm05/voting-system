import { ROUTES } from '#shared/constants/routes'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Guest middleware is used to deny access to routes that should
 * be accessed by unauthenticated users.
 *
 * For example, the login page should not be accessible if the user
 * is already logged-in
 */
export default class GuestCitizenMiddleware {
  /**
   * The URL to redirect to when user is logged-in
   */
  redirectTo = ROUTES.citizen.elections.absolutePath

  async handle(ctx: HttpContext, next: NextFn) {
    const guard = ctx.auth.use('citizen')

    if (await guard.check()) {
      return ctx.response.redirect(this.redirectTo, true)
    }

    return next()
  }
}
