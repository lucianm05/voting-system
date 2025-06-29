import Election from '#models/election'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class Vote extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  /**
   * Encrypted payload of the vote. Includes the createdAt timestamp and the candidateId.
   */
  @column()
  declare payload: string

  @column()
  declare revoked: boolean

  @column()
  declare electionId: string

  @belongsTo(() => Election)
  declare election: BelongsTo<typeof Election>

  @beforeCreate()
  static assignUuid(vote: Vote) {
    vote.id = randomUUID()
  }
}
