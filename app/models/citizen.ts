import Vote from '#models/vote'
import { BaseModel, beforeCreate, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'

export default class Citizen extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: null })
  /**
   * The hash of the person's CNP.
   */
  declare identity: string

  @column()
  declare lastVoteId: string

  @hasOne(() => Vote)
  declare lastVote: HasOne<typeof Vote>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(vote: Vote) {
    vote.id = randomUUID()
  }
}
