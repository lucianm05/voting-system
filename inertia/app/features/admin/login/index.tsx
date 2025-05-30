import { Routes } from '#shared/constants/routes'
import { useForm } from '@inertiajs/react'
import { Button, Card, Center, TextInput } from '@mantine/core'
import { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

export function AdminLoginForm() {
  const { t } = useTranslation()
  const { data, setData, post } = useForm({ email: '', password: '' })

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    post(Routes.admin.login.absolutePath)
  }

  return (
    <Center h="100vh">
      <Card withBorder shadow="sm" padding="xl" className="w-full max-w-[20rem]">
        <form onSubmit={onSubmit} className="space-y-5">
          <TextInput
            type="email"
            name="email"
            label={t('common.email')}
            placeholder="your@email.com"
            withAsterisk
            required
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
          />

          <TextInput
            type="password"
            name="password"
            label={t('common.password')}
            placeholder="**********"
            withAsterisk
            required
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
          />

          <Button w="100%" type="submit" disabled={!data.email || !data.password}>
            {t('common.login')}
          </Button>
        </form>
      </Card>
    </Center>
  )
}
