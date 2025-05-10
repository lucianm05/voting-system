import { Text, TextProps } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { cn } from '~/app/functions'
import { ContainerProps, PropsWithClassName } from '~/app/types'

interface Props extends PropsWithClassName {
  size?: number
}

export function Logo({ size = 48, className }: Props) {
  const { t } = useTranslation()

  return (
    <img
      src="/images/logo.png"
      alt={t('app_title')}
      width={size}
      height={size}
      className={className}
    />
  )
}

interface LogoWithTitleProps extends ContainerProps {
  logoSize?: number
  textSize?: TextProps['size']
}

export function LogoWithTitle({ logoSize = 48, textSize = 'xl', className }: LogoWithTitleProps) {
  const { t } = useTranslation()

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <Logo size={logoSize} />
      <Text size={textSize} fw={500}>
        {t('app_title')}
      </Text>
    </div>
  )
}
