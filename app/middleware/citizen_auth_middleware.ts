import { Routes } from '#shared/constants/routes'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthCitizenMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = Routes.citizen.authentication.index.absolutePath

  async handle(ctx: HttpContext, next: NextFn) {
    const guard = ctx.auth.use('citizen')
    const isAuthenticated = await guard.check()

    if (!isAuthenticated) {
      return ctx.response.redirect(this.redirectTo)
    }

    return next()
  }
}
