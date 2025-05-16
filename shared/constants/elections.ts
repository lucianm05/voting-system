import { ValueOf } from '#shared/types/index'

export const ELECTION_TYPES = {
  local: 'local',
  county: 'county',
  parliamentary: 'parliamentary',
  presidential: 'presidential',
  euro: 'euro',
} as const

export type ElectionType = ValueOf<typeof ELECTION_TYPES>
