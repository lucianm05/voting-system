/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
router.on('/').renderInertia('home')

router
  .group(() => {
    const SessionController = () => import('#controllers/session_controller')
    router.post('/', [SessionController, 'store']).as('session.store')
    router.delete('/', [SessionController, 'destroy']).as('session.destroy')
  })
  .prefix('/session')

router
  .group(() => {
    const AdminController = () => import('#controllers/admin_controller')
    router.on('/').redirect('admin.elections')
    router.on('/login').renderInertia('admin/login', { title: 'Login' }).as('admin.login')
    router.on('/elections').renderInertia('admin/elections').as('admin.elections')
  })
  .prefix('/admin')
  .use(middleware.auth())
