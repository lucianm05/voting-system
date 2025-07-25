/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { Routes } from '#shared/constants/routes'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router.on('/').redirect(Routes.citizen.authentication.index.absolutePath)

// #region Admins auth
router
  .group(() => {
    const AdminsController = () => import('#controllers/admins_controller')

    router.on('/').renderInertia(Routes.admin.login.view).use(middleware.adminGuest())
    router.post('/', [AdminsController, 'login']).use(middleware.adminGuest())
    router.delete('/', [AdminsController, 'logout']).use(middleware.adminAuth())
  })
  .prefix(Routes.admin.login.absolutePath)
// #endregion

// #region Admins dashboard
router
  .group(() => {
    const ElectionsController = () => import('#controllers/elections_controller')
    const CandidatesController = () => import('#controllers/candidates_controller')

    router.on('/').redirect(Routes.admin.elections.index.absolutePath)

    router.get(Routes.admin.elections.index.relativePath, [ElectionsController, 'renderAdminIndex'])
    router
      .on(Routes.admin.elections.create.relativePath)
      .renderInertia(Routes.admin.elections.create.view)
    router.get(Routes.admin.elections.id.relativePath, [ElectionsController, 'renderEdit'])
    router.post(Routes.admin.elections.create.relativePath, [ElectionsController, 'create'])
    router.put(Routes.admin.elections.id.relativePath, [ElectionsController, 'edit'])
    router.delete(Routes.admin.elections.id.relativePath, [ElectionsController, 'delete'])

    router.get(Routes.admin.candidates.index.relativePath, [
      CandidatesController,
      'renderAdminIndex',
    ])
    router.get(Routes.admin.candidates.create.relativePath, [CandidatesController, 'renderCreate'])
    router.get(Routes.admin.candidates.id.relativePath, [CandidatesController, 'renderEdit'])
    router.post(Routes.admin.candidates.create.relativePath, [CandidatesController, 'create'])
    router.put(Routes.admin.candidates.id.relativePath, [CandidatesController, 'edit'])
    router.delete(Routes.admin.candidates.id.relativePath, [CandidatesController, 'delete'])
  })
  .prefix(Routes.admin.index.absolutePath)
  .use(middleware.adminAuth())
// #endregion

// #region Citizens
router
  .group(() => {
    const CitizensController = () => import('#controllers/citizens_controller')
    const ElectionsController = () => import('#controllers/elections_controller')
    const VotesController = () => import('#controllers/votes_controller')

    router
      .group(() => {
        router.on('/').redirectToPath(Routes.citizen.authentication.index.absolutePath)

        router.get(Routes.citizen.authentication.index.relativePath, [
          CitizensController,
          'renderIndex',
        ])

        router.post(Routes.citizen.authentication.index.relativePath, [
          CitizensController,
          'attemptIdentityCardValidation',
        ])

        router.post(Routes.citizen.authentication.login.relativePath, [CitizensController, 'login'])
      })
      .use(middleware.citizenGuest())

    router
      .group(() => {
        router
          .on(Routes.citizen.elections.index.relativePath)
          .redirectToPath(Routes.citizen.elections.active.absolutePath)
        router.get(Routes.citizen.elections.active.relativePath, [
          ElectionsController,
          'renderCitizenActive',
        ])
        router.get(Routes.citizen.elections.ended.relativePath, [
          ElectionsController,
          'renderCitizenEnded',
        ])
        router.get(Routes.citizen.elections.future.relativePath, [
          ElectionsController,
          'renderCitizenFuture',
        ])
        router.get(Routes.citizen.elections.vote.relativePath, [ElectionsController, 'renderVote'])
        router.get(Routes.citizen.elections.verifyVote.relativePath, [
          ElectionsController,
          'renderVerifyVote',
        ])
        router.get(Routes.citizen.elections.results.relativePath, [
          ElectionsController,
          'renderResults',
        ])
        router.post(Routes.citizen.elections.vote.relativePath, [VotesController, 'create'])
      })
      .use(middleware.citizenAuth())
  })
  .prefix(Routes.citizen.index.absolutePath)
// #endregion
