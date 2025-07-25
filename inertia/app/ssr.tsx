import { createInertiaApp } from '@inertiajs/react'
import ReactDOMServer from 'react-dom/server'
import { Providers } from '~/app/shared/providers'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
      return pages[`../pages/${name}.tsx`]
    },
    setup: ({ App, props }) => (
      <Providers>
        <App {...props} />
      </Providers>
    ),
  })
}
