import { Card, CardProps, Divider } from '@mantine/core'
import { LogoWithTitle } from '~/app/components/ui/logo'

export function CardWithLogo({ children, ...props }: CardProps) {
  return (
    <Card withBorder padding="0" shadow="sm" className="w-full max-w-[28rem]" {...props}>
      <LogoWithTitle logoSize={40} textSize="lg" className="px-8 py-4" />

      <Divider />

      {children}
    </Card>
  )
}
