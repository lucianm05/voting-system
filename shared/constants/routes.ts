export const ROUTES = {
  session: {
    root: {
      absolutePath: '/session',
      alias: 'session',
    },
    store: {
      absolutePath: '/session',
      relativePath: '/',
      alias: 'session.store',
    },
    destroy: {
      absolutePath: '/session',
      relativePath: '/',
      alias: 'session.destroy',
    },
  },

  admin: {
    root: {
      absolutePath: '/admin',
      alias: 'admin',
    },
    login: {
      absolutePath: '/admin/login',
      relativePath: '/login',
      alias: 'admin.login',
      view: 'admin/login',
    },
    elections: {
      index: {
        absolutePath: '/admin/elections',
        relativePath: '/elections',
        alias: 'admin.elections.index',
        view: 'admin/elections/index',
      },
      create: {
        index: {
          absolutePath: '/admin/elections/create',
          relativePath: '/elections/create',
          alias: 'admin.elections.create.index',
          view: 'admin/elections/create',
        },
        store: {
          absolutePath: '/admin/elections/create',
          relativePath: '/elections/create',
          alias: 'admin.elections.create.store',
        },
      },
    },
    candidates: {
      index: {
        absolutePath: '/admin/candidates',
        relativePath: '/candidates',
        alias: 'admin.candidates.index',
        view: 'admin/candidates/index',
      },
      create: {
        index: {
          absolutePath: '/admin/candidates/create',
          relativePath: '/candidates/create',
          alias: 'admin.candidates.create.index',
          view: 'admin/candidates/create',
        },
        store: {
          absolutePath: '/admin/candidates/create',
          relativePath: '/candidates/create',
          alias: 'admin.candidates.create.store',
        },
      },
    },
  },

  citizen: {
    root: {
      absolutePath: '/citizen',
      relativePath: '/citizen',
      alias: 'citizen',
    },
    authentication: {
      index: {
        absolutePath: '/citizen/authentication',
        relativePath: '/authentication',
        alias: 'citizen.authentication.index',
        view: 'citizen/authentication/index',
      },
      attempt: {
        absolutePath: '/citizen/authentication/attempt',
        relativePath: '/authentication/attempt',
        alias: 'citizen.authentication.attempt',
      },
    },
  },
} as const
