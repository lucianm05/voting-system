import { ROUTES } from '#shared/constants/routes'
import type { Authenticators } from '@adonisjs/auth/types'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = ROUTES.admin.login.absolutePath

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    const admin = await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    console.log('admin', admin)
    return next()
  }
}
