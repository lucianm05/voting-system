import { FlashMessageTypes } from '#shared/constants/flash_messages'
import { FlashMessage } from '#shared/types/index'
import { usePage } from '@inertiajs/react'
import { notifications } from '@mantine/notifications'
import { useEffect } from 'react'

const TypeToColorMap = {
  [FlashMessageTypes.error]: 'red',
  [FlashMessageTypes.info]: 'blue',
  [FlashMessageTypes.success]: 'green',
  [FlashMessageTypes.warning]: 'yellow',
} as const

export function useFlashNotification() {
  const page = usePage<{ flashMessages: Record<string, FlashMessage> }>()
  const { flashMessages } = page.props

  useEffect(() => {
    const messages = Object.values(flashMessages ?? {})

    if (messages.length) {
      messages.forEach((flash) => {
        notifications.show({ message: flash.message, color: TypeToColorMap[flash.type] })
      })
    }
  }, [flashMessages])
}
