import { CANDIDATE_TYPES } from '#shared/constants/candidates'
import { SEARCH_PARAMS } from '#shared/constants/search_params'
import vine from '@vinejs/vine'

export const getCandidatesValidator = vine.compile(
  vine.object({
    [SEARCH_PARAMS.electionId]: vine.string().uuid().optional(),
  })
)

export const createCandidateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    type: vine.enum([CANDIDATE_TYPES.independent, CANDIDATE_TYPES.party]),
    electionId: vine.string().minLength(1),
    county: vine.string().optional(),
    locality: vine.string().optional(),
  })
)
