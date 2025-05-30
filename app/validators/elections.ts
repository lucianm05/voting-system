import { ElectionTypes } from '#shared/constants/elections'
import vine from '@vinejs/vine'

export const createElectionValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    description: vine.string().trim().minLength(1),
    electionType: vine.enum([
      ElectionTypes.county,
      ElectionTypes.euro,
      ElectionTypes.local,
      ElectionTypes.parliamentary,
      ElectionTypes.presidential,
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
