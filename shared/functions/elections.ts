import Election from '#models/election'
import { ElectionTypes } from '#shared/constants/elections'
import { isFuture, isPast, isPresent } from '#shared/functions/dates'

export function isElection(election: Election) {
  return {
    local: election.electionType === ElectionTypes.local,
    county: election.electionType === ElectionTypes.county,
    parliamentary: election.electionType === ElectionTypes.parliamentary,
    presidential: election.electionType === ElectionTypes.presidential,
    euro: election.electionType === ElectionTypes.euro,
  }
}

export function isElectionActive(election: Election) {
  if (!election) return false
  return isPresent(election.dateStart, election.dateEnd)
}

export function isElectionFuture(election: Election) {
  if (!election) return false
  return isFuture(election.dateStart)
}

export function isElectionPast(election: Election) {
  if (!election) return false
  return isPast(election.dateEnd)
}
