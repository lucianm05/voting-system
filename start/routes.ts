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

// #region Admins auth
router
  .group(() => {
    const AdminsController = () => import('#controllers/admins_controller')

    router.on('/').renderInertia(ROUTES.admin.login.view).use(middleware.guest())
    router.post('/', [AdminsController, 'login']).use(middleware.guest())
    router.delete('/', [AdminsController, 'logout']).use(middleware.auth())
  })
  .prefix(ROUTES.admin.login.absolutePath)
// #endregion

// #region Admins dashboard
router
  .group(() => {
    const ElectionsController = () => import('#controllers/elections_controller')
    const CandidatesController = () => import('#controllers/candidates_controller')

    router.on('/').redirect(ROUTES.admin.elections.index.alias)

    router.get(ROUTES.admin.elections.index.relativePath, [ElectionsController, 'renderAdminIndex'])
    router
      .on(ROUTES.admin.elections.create.relativePath)
      .renderInertia(ROUTES.admin.elections.create.view)
    router.post(ROUTES.admin.elections.create.relativePath, [ElectionsController, 'create'])

    router.get(ROUTES.admin.candidates.index.relativePath, [
      CandidatesController,
      'renderAdminIndex',
    ])
    router.get(ROUTES.admin.candidates.create.relativePath, [CandidatesController, 'renderCreate'])
    router.post(ROUTES.admin.candidates.create.relativePath, [CandidatesController, 'create'])
  })
  .prefix(ROUTES.admin.index.absolutePath)
  .use(middleware.auth())
// #endregion

// #region Citizens
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

    router.on(ROUTES.citizen.elections.relativePath).renderInertia(ROUTES.citizen.elections.view)
    // .use(middleware.citizen())
  })
  .prefix(ROUTES.citizen.index.absolutePath)
// #endregion
