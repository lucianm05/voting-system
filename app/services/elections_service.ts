import Election from '#models/election'
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
}
