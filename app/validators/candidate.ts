import { CANDIDATE_TYPES } from '#shared/constants/candidates'
import vine from '@vinejs/vine'

export const createCandidateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    type: vine.enum([CANDIDATE_TYPES.independent, CANDIDATE_TYPES.party]),
    electionId: vine.string().minLength(1),
  })
)
