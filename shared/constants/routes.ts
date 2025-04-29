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
      absolutePath: '/admin/elections',
      relativePath: '/elections',
      alias: 'admin.elections',
      view: 'admin/elections',
    },
    newElection: {
      absolutePath: '/admin/new-election',
      relativePath: '/new-election',
      alias: 'admin.newElection',
      view: 'admin/new-election',
    },
    candidates: {
      absolutePath: '/admin/candidates',
      relativePath: '/candidates',
      alias: 'admin.candidates',
    },
  },
} as const
