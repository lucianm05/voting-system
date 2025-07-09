import { Text } from '@mantine/core'
import { cn } from '~/app/shared/functions'
import { ContainerProps } from '~/app/shared/types'

interface Props extends ContainerProps {
  label: string
}

export function GraphContainer({ children, className, label }: Props) {
  return (
    <div className={cn(className, 'text-center w-max space-y-2')}>
      {children}

      <Text size="sm" c="gray.7">
        {label}
      </Text>
    </div>
  )
}
