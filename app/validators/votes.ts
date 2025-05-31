import vine from '@vinejs/vine'

export const createVoteValidator = vine.compile(
  vine.object({
    electionId: vine.string().uuid(),
    candidateId: vine.string().uuid(),
  })
)
