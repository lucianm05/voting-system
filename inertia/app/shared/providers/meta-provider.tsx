import { Head } from '@inertiajs/react'
import { PropsWithChildren } from 'react'

export function MetaProvider({ children }: PropsWithChildren) {
  return (
    <>
      <Head>
        <link rel="icon" href="/images/logo.png" />
      </Head>

      {children}
    </>
  )
}
