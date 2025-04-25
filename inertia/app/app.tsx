/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '@mantine/core/styles.css'

import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { createInertiaApp } from '@inertiajs/react'
import { Notifications } from '@mantine/notifications'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Providers } from '~/app/providers'
import '../css/app.css'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => {
    return resolvePageComponent(`../pages/${name}.tsx`, import.meta.glob('../pages/**/*.tsx'))
  },
  setup({ el, App, props }) {
    const RootComponent = (
      <Providers>
        <Notifications position="top-right" />
        <App {...props} />
      </Providers>
    )

    if (import.meta.env.SSR) {
      hydrateRoot(el, RootComponent)
    } else {
      createRoot(el).render(RootComponent)
    }
  },
})
