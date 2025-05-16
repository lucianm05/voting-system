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

router.on('/').redirect(ROUTES.citizen.authentication.index.absolutePath)

router
  .group(() => {
    const AdminsController = () => import('#controllers/admins_controller')

    router.on('/').renderInertia(ROUTES.admin.login.view).use(middleware.guest())
    router.post('/', [AdminsController, 'login']).use(middleware.guest())
    router.delete('/', [AdminsController, 'logout']).use(middleware.auth())
  })
  .prefix(ROUTES.admin.login.absolutePath)

router
  .group(() => {
    const ElectionsController = () => import('#controllers/elections_controller')
    const CandidatesController = () => import('#controllers/candidates_controller')

    router.on('/').redirect(ROUTES.admin.elections.index.alias)

    router
      .get(ROUTES.admin.elections.index.relativePath, [ElectionsController, 'renderAdminIndex'])
      .as(ROUTES.admin.elections.index.alias)
    router
      .on(ROUTES.admin.elections.create.relativePath)
      .renderInertia(ROUTES.admin.elections.create.view)
      .as(ROUTES.admin.elections.create.alias)
    router
      .post(ROUTES.admin.elections.create.relativePath, [ElectionsController, 'create'])
      .as(ROUTES.admin.elections.create.alias)

    router
      .get(ROUTES.admin.candidates.index.relativePath, [CandidatesController, 'renderIndex'])
      .as(ROUTES.admin.candidates.index.alias)
    router
      .get(ROUTES.admin.candidates.create.relativePath, [CandidatesController, 'renderCreate'])
      .as(ROUTES.admin.candidates.create.alias)
    router
      .post(ROUTES.admin.candidates.create.relativePath, [CandidatesController, 'create'])
      .as(ROUTES.admin.candidates.create.alias)
  })
  .prefix(ROUTES.admin.index.absolutePath)
  .use(middleware.auth())

router
  .group(() => {
    const CitizensController = () => import('#controllers/citizens_controller')

    router
      .get(ROUTES.citizen.authentication.index.relativePath, [CitizensController, 'renderIndex'])
      .use(middleware.guestCitizen())

    router
      .post(ROUTES.citizen.authentication.index.relativePath, [
        CitizensController,
        'renderAttemptAuthentication',
      ])
      .use(middleware.guestCitizen())

    router
      .post(ROUTES.citizen.authentication.login.relativePath, [CitizensController, 'login'])
      .use(middleware.guestCitizen())

    router
      .on(ROUTES.citizen.elections.relativePath)
      .renderInertia(ROUTES.citizen.elections.view)
      .use(middleware.citizen())
  })
  .prefix(ROUTES.citizen.index.absolutePath)
