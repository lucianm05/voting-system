import { useTranslation } from 'react-i18next'

interface Props {
  size?: number
  className?: string
}

export function Logo({ size = 48, className }: Props) {
  const { t } = useTranslation()

  return (
    <img
      src="/resources/images/logo.png"
      alt={t('app_title')}
      width={size}
      height={size}
      className={className}
    />
  )
}
