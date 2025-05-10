import { IMAGE_EXTENSIONS } from '#shared/constants/files'
import vine from '@vinejs/vine'

export const attemptAuthenticationValidator = vine.compile(
  vine.object({
    file: vine.file({
      extnames: IMAGE_EXTENSIONS,
    }),
  })
)
