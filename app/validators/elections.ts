import vine from '@vinejs/vine'

export const createElectionValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    description: vine.string().trim().minLength(1),
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
