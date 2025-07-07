import { FlashMessageTypes } from '#shared/constants/flash_messages'
import { FlashMessage } from '#shared/types/index'
import { usePage } from '@inertiajs/react'
import { notifications } from '@mantine/notifications'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const TypeToColorMap = {
  [FlashMessageTypes.error]: 'red',
  [FlashMessageTypes.info]: 'blue',
  [FlashMessageTypes.success]: 'green',
  [FlashMessageTypes.warning]: 'yellow',
} as const

const TypeToTitleMap = {
  [FlashMessageTypes.error]: 'common.error',
  [FlashMessageTypes.info]: 'common.info',
  [FlashMessageTypes.success]: 'common.success',
  [FlashMessageTypes.warning]: 'common.warning',
} as const

export function useFlashNotification() {
  const { t } = useTranslation()
  const page = usePage<{ flashMessages: Record<string, FlashMessage> }>()

  useEffect(() => {
    const { flashMessages } = page.props
    const messages = Object.values(flashMessages ?? {}).filter((flash) => Boolean(flash.type))

    messages.forEach((flash) => {
      notifications.show({
        title: t(TypeToTitleMap[flash.type]),
        color: TypeToColorMap[flash.type],
        message: flash.message,
      })
    })
  }, [page.props.flashMessages])
}
