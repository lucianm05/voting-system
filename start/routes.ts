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

    router.on('/').renderInertia(ROUTES.admin.login.view).use(middleware.adminGuest())
    router.post('/', [AdminsController, 'login']).use(middleware.adminGuest())
    router.delete('/', [AdminsController, 'logout']).use(middleware.citizenGuest())
  })
  .prefix(ROUTES.admin.login.absolutePath)
// #endregion

// #region Admins dashboard
router
  .group(() => {
    const ElectionsController = () => import('#controllers/elections_controller')
    const CandidatesController = () => import('#controllers/candidates_controller')

    router.on('/').redirect(ROUTES.admin.elections.index.absolutePath)

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
  .use(middleware.adminAuth())
// #endregion

// #region Citizens
router
  .group(() => {
    const CitizensController = () => import('#controllers/citizens_controller')
    const ElectionsController = () => import('#controllers/elections_controller')

    router
      .get(ROUTES.citizen.authentication.index.relativePath, [CitizensController, 'renderIndex'])
      .use(middleware.citizenGuest())

    router
      .post(ROUTES.citizen.authentication.index.relativePath, [
        CitizensController,
        'renderAttemptAuthentication',
      ])
      .use(middleware.citizenGuest())

    router
      .post(ROUTES.citizen.authentication.login.relativePath, [CitizensController, 'login'])
      .use(middleware.citizenGuest())

    router
      .get(ROUTES.citizen.elections.index.relativePath, [
        ElectionsController,
        'renderCitizensIndex',
      ])
      .use(middleware.citizenAuth())
  })
  .prefix(ROUTES.citizen.index.absolutePath)
// #endregion
