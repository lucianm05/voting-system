import { ValueOf } from '#shared/types/index'

export const ElectionTypes = {
  local: 'local',
  county: 'county',
  parliamentary: 'parliamentary',
  presidential: 'presidential',
  euro: 'euro',
} as const

export type ElectionType = ValueOf<typeof ElectionTypes>
