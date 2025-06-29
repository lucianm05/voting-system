import { IMAGE_EXTENSIONS } from '#shared/constants/files'
import { cnpRule } from '#validators/rules/cnp'
import { idValidityRule } from '#validators/rules/id_validity'
import vine from '@vinejs/vine'

export const attemptAuthenticationValidator = vine.compile(
  vine.object({
    file: vine.file({
      extnames: IMAGE_EXTENSIONS,
    }),
  })
)

export const cnpValidator = vine.compile(vine.string().use(cnpRule({ minAge: 18 })))

export const identityCardValidator = vine.compile(
  vine.object({
    cnp: vine.string().use(cnpRule({ minAge: 18 })),
    address: vine.string(),
    firstName: vine.string(),
    lastName: vine.string(),
    validity: vine.string().use(idValidityRule()),
  })
)
