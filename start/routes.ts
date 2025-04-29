/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { ROUTES } from '#shared/constants/routes'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
router.on('/').renderInertia('home')

router
  .group(() => {
    const SessionController = () => import('#controllers/session_controller')

    router.post('/', [SessionController, 'store']).as(ROUTES.session.store.alias)

    router.delete('/', [SessionController, 'destroy']).as(ROUTES.session.destroy.alias)
  })
  .prefix('/session')

router
  .group(() => {
    // const AdminController = () => import('#controllers/admin_controller')

    router.on('/').redirect(ROUTES.admin.elections.alias)

    router
      .on(ROUTES.admin.login.relativePath)
      .renderInertia(ROUTES.admin.login.view)
      .as(ROUTES.admin.login.alias)

    router
      .on(ROUTES.admin.elections.relativePath)
      .renderInertia(ROUTES.admin.elections.view)
      .as(ROUTES.admin.elections.alias)

    router
      .on(ROUTES.admin.newElection.relativePath)
      .renderInertia(ROUTES.admin.newElection.view)
      .as(ROUTES.admin.newElection.alias)
  })
  .prefix(ROUTES.admin.root.absolutePath)
  .use(middleware.guest())
  .use(middleware.auth())
