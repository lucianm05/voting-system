import { CandidateTypes } from '#shared/constants/candidates'
import { SearchParams } from '#shared/constants/search_params'
import vine from '@vinejs/vine'

export const getCandidatesValidator = vine.compile(
  vine.object({
    [SearchParams.electionId]: vine.string().uuid().optional(),
  })
)

export const createCandidateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    type: vine.enum([CandidateTypes.independent, CandidateTypes.party]),
    electionId: vine.string().minLength(1),
    county: vine.string().optional(),
    locality: vine.string().optional(),
  })
)
