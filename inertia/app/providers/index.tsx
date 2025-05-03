import { PropsWithChildren } from 'react'
import { I18nextProvider } from 'react-i18next'
import { DayjsProvider } from '~/app/providers/days-provider'
import { MantineProvider } from '~/app/providers/mantine-provider'
import i18n from '~/i18n'

export function Providers({ children }: PropsWithChildren) {
  return (
    <I18nextProvider i18n={i18n}>
      <DayjsProvider>
        <MantineProvider>{children}</MantineProvider>
      </DayjsProvider>
    </I18nextProvider>
  )
}
