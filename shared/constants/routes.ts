export const Routes = {
  admin: {
    index: {
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
        absolutePath: '/admin/elections/create',
        relativePath: '/elections/create',
        alias: 'admin.elections.create.index',
        view: 'admin/elections/create',
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
        absolutePath: '/admin/candidates/create',
        relativePath: '/candidates/create',
        alias: 'admin.candidates.create.index',
        view: 'admin/candidates/create',
      },
    },
  },

  citizen: {
    index: {
      absolutePath: '/citizen',
      relativePath: '/citizen',
      alias: 'citizen',
    },
    authentication: {
      index: {
        absolutePath: '/citizen/authentication',
        relativePath: '/authentication',
        alias: 'citizen.authentication.index',
        view: 'citizen/authentication',
      },
      /**
       * When the citizen is uploading the ID, they "attempt" to authenticate.
       */
      attempt: {
        absolutePath: '/citizen/authentication/attempt',
        relativePath: '/authentication/attempt',
        alias: 'citizen.authentication.attempt',
      },
      /**
       * When the citizen is validating their identity based on the ID.
       */
      validate: {
        absolutePath: '/citizen/authentication/validate',
        relativePath: '/authentication/validate',
        alias: 'citizen.authentication.validate',
      },
      /**
       * When the citizen uploaded the ID and validated their identity, we mark the authentication as passed and let them through.
       */
      login: {
        absolutePath: '/citizen/authentication/login',
        relativePath: '/authentication/login',
        alias: 'citizen.authentication.login',
      },
    },

    elections: {
      index: {
        absolutePath: '/citizen/elections',
        relativePath: '/elections',
        view: 'citizen/elections/index',
      },
      vote: {
        absolutePath: '/citizen/elections/:id/vote',
        relativePath: '/elections/:id/vote',
        view: 'citizen/elections/vote',
      },
      results: {
        absolutePath: '/citizen/elections/:id/results',
        relativePath: '/elections/:id/results',
        view: 'citizen/elections/results',
      },
    },

    myVote: {
      absolutePath: '/citizen/my-vote',
      relativePath: '/my-vote',
      view: 'citizen/my-vote',
    },
  },
} as const
