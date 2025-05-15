import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'

export default class Vote extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare payload: string

  @beforeCreate()
  static assignUuid(vote: Vote) {
    vote.id = randomUUID()
  }
}
