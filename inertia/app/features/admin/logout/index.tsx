import { ROUTES } from '#shared/constants/routes'
import { useForm } from '@inertiajs/react'
import { Button } from '@mantine/core'
import { FormEvent } from 'react'

interface Props {
  className?: string
}

export function AdminLogoutForm({ className }: Props) {
  const { delete: del } = useForm()

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    del(ROUTES.session.root.absolutePath)
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <Button type="submit" w="100%" variant="default">
        Logout
      </Button>
    </form>
  )
}
