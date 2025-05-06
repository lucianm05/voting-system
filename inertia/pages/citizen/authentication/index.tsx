import { Card, Center, Divider, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { LogoWithTitle } from '~/app/components/ui/logo'

export default function CitizenAuthentication() {
  const { t } = useTranslation()

  return (
    <main className="px-4">
      <Center h="100vh">
        <Card withBorder padding="0" shadow="sm" className="w-full max-w-[28rem]">
          <LogoWithTitle logoSize={40} textSize="lg" className="px-8 py-4" />
          <Divider />
          <div className="px-8 py-4 space-y-1">
            <Title size="xl">{t('citizen.authentication.title')}</Title>
            <Text size="sm" className="whitespace-pre-line">
              {t('citizen.authentication.description')}
            </Text>
          </div>
        </Card>
      </Center>
    </main>
  )
}
