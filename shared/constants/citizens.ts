import { ValueOf } from '#shared/types/index'

export const CitizenAuthSteps = {
  uploadID: 'UPLOAD_ID',
  validation: 'VALIDATION',
} as const

export type CitizenAuthStep = ValueOf<typeof CitizenAuthSteps>
