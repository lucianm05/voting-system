import { useForm } from '@inertiajs/react'
import { Button, Card, Center, TextInput } from '@mantine/core'
import { FormEvent } from 'react'

export function AdminLoginForm() {
  const { data, setData, post } = useForm({ email: '', password: '' })

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    post('/session')
  }

  return (
    <Center h="100vh">
      <Card withBorder shadow="sm" padding="xl" className="w-full max-w-[20rem]">
        <form onSubmit={onSubmit} className="space-y-5">
          <TextInput
            type="email"
            name="email"
            label="Email"
            placeholder="your@email.com"
            withAsterisk
            required
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
          />

          <TextInput
            type="password"
            name="password"
            label="Password"
            placeholder="**********"
            withAsterisk
            required
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
          />

          <Button w="100%" type="submit" disabled={!data.email || !data.password}>
            Login
          </Button>
        </form>
      </Card>
    </Center>
  )
}
