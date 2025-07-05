import vine from '@vinejs/vine'

export const createVoteValidator = vine.compile(
  vine.object({
    candidateId: vine.string().uuid(),
  })
)
