/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '../css/app.css'

import 'dayjs/locale/en'
import 'dayjs/locale/ro'

import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { createInertiaApp } from '@inertiajs/react'
import { Notifications } from '@mantine/notifications'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Providers } from '~/app/providers'
import i18n from '~/i18n'

dayjs.extend(customParseFormat)

createInertiaApp({
  progress: { color: '#5468FF' },
  title: () => i18n.t('app_title'),
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
