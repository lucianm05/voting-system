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
    const SessionsController = () => import('#controllers/sessions_controller')

    router.post('/', [SessionsController, 'store']).as(ROUTES.session.store.alias)

    router.delete('/', [SessionsController, 'destroy']).as(ROUTES.session.destroy.alias)
  })
  .prefix('/session')

router
  .group(() => {
    const ElectionsController = () => import('#controllers/elections_controller')
    const CandidatesController = () => import('#controllers/candidates_controller')

    router.on('/').redirect(ROUTES.admin.elections.index.alias)

    router
      .on(ROUTES.admin.login.relativePath)
      .renderInertia(ROUTES.admin.login.view)
      .as(ROUTES.admin.login.alias)

    router
      .get(ROUTES.admin.elections.index.relativePath, [ElectionsController, 'index'])
      .as(ROUTES.admin.elections.index.alias)
    router
      .on(ROUTES.admin.elections.create.index.relativePath)
      .renderInertia(ROUTES.admin.elections.create.index.view)
      .as(ROUTES.admin.elections.create.index.alias)
    router
      .post(ROUTES.admin.elections.create.store.relativePath, [ElectionsController, 'store'])
      .as(ROUTES.admin.elections.create.store.alias)

    router
      .get(ROUTES.admin.candidates.index.relativePath, [CandidatesController, 'index'])
      .as(ROUTES.admin.candidates.index.alias)
    router
      .get(ROUTES.admin.candidates.create.index.relativePath, [CandidatesController, 'createIndex'])
      .as(ROUTES.admin.candidates.create.index.alias)
    router
      .post(ROUTES.admin.candidates.create.store.relativePath, [CandidatesController, 'store'])
      .as(ROUTES.admin.candidates.create.store.alias)
  })
  .prefix(ROUTES.admin.root.absolutePath)
  .use(middleware.guest())
  .use(middleware.auth())

router
  .group(() => {
    const CitizensController = () => import('#controllers/citizens_controller')

    router
      .on(ROUTES.citizen.authentication.index.relativePath)
      .renderInertia(ROUTES.citizen.authentication.index.view)

    router.post(ROUTES.citizen.authentication.attempt.relativePath, [
      CitizensController,
      'attemptAuthentication',
    ])
  })
  .prefix(ROUTES.citizen.root.absolutePath)
