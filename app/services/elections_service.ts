import Election from '#models/election'
import Result from '#models/result'
import Vote from '#models/vote'
import dayjs from 'dayjs'

export default class ElectionsService {
  static async findActiveElections() {
    const currentDate = dayjs(undefined, { utc: true }).toISOString()

    const elections = await Election.query()
      .where((builder) => {
        builder.where('date_start', '<', currentDate)
        builder.where('date_end', '>', currentDate)
      })
      .orderBy('createdAt', 'desc')

    return elections
  }

  static async findFutureElections() {
    const currentDate = dayjs(undefined, { utc: true }).toISOString()

    const elections = await Election.query()
      .where((builder) => {
        builder.where('date_start', '>', currentDate)
      })
      .orderBy('createdAt', 'desc')

    return elections
  }

  static async findEndedElections() {
    const currentDate = dayjs(undefined, { utc: true }).toISOString()

    const elections = await Election.query()
      .where((builder) => {
        builder.where('date_end', '<=', currentDate)
      })
      .orderBy('createdAt', 'desc')

    return elections
  }

  private static statistics = {
    async allVotesCount(election: Election) {
      const [result] = await Vote.query().count('* as total').where({ electionId: election.id })

      return Number(result.$extras.total) || 0
    },

    /**
     * The total number of votes which were not revoked and counted to the results.
     */
    async registeredVotesCount(election: Election) {
      const [result] = await Vote.query()
        .count('* as total')
        .where((builder) => {
          builder.where({ revoked: false })
          builder.where({ electionId: election.id })
        })

      return Number(result.$extras.total) || 0
    },

    async revokedVotesCount(election: Election) {
      const [result] = await Vote.query()
        .count('* as total')
        .where((builder) => {
          builder.where({ revoked: true })
          builder.where({ electionId: election.id })
        })

      return Number(result.$extras.total) || 0
    },

    async results(election: Election) {
      const results = await Result.findManyBy({ electionId: election.id })
      await Promise.all(results.map((r) => r.load('candidate')))

      return results
    },
  }

  static async generateStatistics(election: Election) {
    const [allVotes, registeredVotes, revokedVotes, results] = await Promise.all([
      ElectionsService.statistics.allVotesCount(election),
      ElectionsService.statistics.registeredVotesCount(election),
      ElectionsService.statistics.revokedVotesCount(election),
      ElectionsService.statistics.results(election),
    ])

    return { allVotes, registeredVotes, revokedVotes, results }
  }
}
