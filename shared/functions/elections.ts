import Election from '#models/election'
import { ELECTION_TYPES } from '#shared/constants/elections'

export function isElection(election: Election) {
  return {
    local: election.electionType === ELECTION_TYPES.local,
    county: election.electionType === ELECTION_TYPES.county,
    parliamentary: election.electionType === ELECTION_TYPES.parliamentary,
    presidential: election.electionType === ELECTION_TYPES.presidential,
    euro: election.electionType === ELECTION_TYPES.euro,
  }
}
