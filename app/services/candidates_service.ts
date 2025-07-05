import Candidate from '#models/candidate'
import Election from '#models/election'
import { isElection } from '#shared/functions/elections'
import { removeDiacritics } from '#shared/functions/index'
import { CitizenLocation } from '#shared/types/index'

interface FindElectionCandidatesPayload {
  election: Election
  citizenLocation: CitizenLocation
}

interface CanVoteForCandidatePayload {
  candidate: Candidate
  citizenLocation: CitizenLocation
}

export default class CandidatesService {
  static async findElectionCandidates({
    election,
    citizenLocation,
  }: FindElectionCandidatesPayload) {
    const is = isElection(election)
    const candidatesQuery = Candidate.query().where({ electionId: election.id })

    if (is.county) {
      if (!citizenLocation.county?.auto) throw new Error('Citizen\s county is missing')

      candidatesQuery.where({ county: citizenLocation.county.auto })
    }

    if (is.local) {
      if (!citizenLocation.county?.auto) throw new Error("Citizen's county is missing")
      if (!citizenLocation.locality?.nume && !citizenLocation.locality?.comuna)
        throw new Error("Citizen's locality is missing")

      candidatesQuery.where({
        county: citizenLocation.county.auto,
        locality: removeDiacritics(
          citizenLocation.locality.comuna || citizenLocation.locality.nume
        ),
      })
    }

    return candidatesQuery
  }

  static async canVoteForCandidate({ candidate, citizenLocation }: CanVoteForCandidatePayload) {
    await candidate.load('election')

    const candidates = await CandidatesService.findElectionCandidates({
      election: candidate.election,
      citizenLocation,
    })

    return candidates.find((c) => c.id === candidate.id)
  }
}
