import { ValueOf } from '#shared/types/index'

export const CITIZEN_AUTH_STEPS = {
  uploadID: 'UPLOAD_ID',
  validation: 'VALIDATION',
} as const

export type CitizenAuthStep = ValueOf<typeof CITIZEN_AUTH_STEPS>
