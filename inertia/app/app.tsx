/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Providers } from '~/app/providers'
import i18n from '~/i18n'

createInertiaApp({
  progress: { color: '#5468FF' },
  title: () => i18n.t('app_title'),
  resolve: (name) => {
    return resolvePageComponent(`../pages/${name}.tsx`, import.meta.glob('../pages/**/*.tsx'))
  },
  setup({ el, App, props }) {
    const RootComponent = (
      <Providers>
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
