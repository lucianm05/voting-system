import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class FlashMessagesMiddleware {
  async handle({ session, inertia }: HttpContext, next: NextFn) {
    const messages = session.flashMessages || []

    inertia.share({ flashMessages: messages.all() })

    session.flashMessages.clear()

    return next()
  }
}
