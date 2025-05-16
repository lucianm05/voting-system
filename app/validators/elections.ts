import { ELECTION_TYPES } from '#shared/constants/elections'
import vine from '@vinejs/vine'

export const createElectionValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    description: vine.string().trim().minLength(1),
    electionType: vine.enum([
      ELECTION_TYPES.county,
      ELECTION_TYPES.euro,
      ELECTION_TYPES.local,
      ELECTION_TYPES.parliamentary,
      ELECTION_TYPES.presidential,
    ]),
    dateStart: vine.date({
      formats: ['iso8601'],
    }),
    dateEnd: vine
      .date({
        formats: ['iso8601'],
      })
      .afterField('dateStart', { compare: 'millisecond' }),
  })
)
