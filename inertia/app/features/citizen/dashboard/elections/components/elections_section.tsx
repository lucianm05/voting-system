import Election from '#models/election'
import { Title } from '@mantine/core'
import { ElectionsList } from '~/app/features/citizen/dashboard/elections/components/elections_list'
import { PropsWithClassName } from '~/app/shared/types'

interface Props extends PropsWithClassName {
  title: string
  elections: Election[] | undefined
}

export function ElectionsSection({ elections, className, title }: Props) {
  return (
    <section className={className}>
      <Title order={2}>{title}</Title>
      <ElectionsList elections={elections} />
    </section>
  )
}
