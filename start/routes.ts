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
    const ElectionController = () => import('#controllers/election_controller')

    router.on('/').redirect(ROUTES.admin.elections.index.alias)

    router
      .on(ROUTES.admin.login.relativePath)
      .renderInertia(ROUTES.admin.login.view)
      .as(ROUTES.admin.login.alias)

    router
      .get(ROUTES.admin.elections.index.relativePath, [ElectionController, 'index'])
      .as(ROUTES.admin.elections.index.alias)

    router
      .on(ROUTES.admin.newElection.index.relativePath)
      .renderInertia(ROUTES.admin.newElection.index.view)
      .as(ROUTES.admin.newElection.index.alias)
    router
      .post(ROUTES.admin.newElection.store.relativePath, [ElectionController, 'store'])
      .as(ROUTES.admin.newElection.store.alias)
  })
  .prefix(ROUTES.admin.root.absolutePath)
  .use(middleware.guest())
  .use(middleware.auth())
