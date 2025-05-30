import Election from '#models/election'
import { ElectionTypes } from '#shared/constants/elections'

export function isElection(election: Election) {
  return {
    local: election.electionType === ElectionTypes.local,
    county: election.electionType === ElectionTypes.county,
    parliamentary: election.electionType === ElectionTypes.parliamentary,
    presidential: election.electionType === ElectionTypes.presidential,
    euro: election.electionType === ElectionTypes.euro,
  }
}
