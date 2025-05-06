import { Card } from '@mantine/core'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()

  return (
    <main>
      <Card></Card>
    </main>
  )
}
