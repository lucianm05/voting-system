import type { ElectionType } from '#shared/constants/elections'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import dayjs from 'dayjs'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'

export default class Election extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare description: string

  @column({
    consume: (value: string) => new Date(value),
    prepare: (value: Date) => dayjs(value, { utc: true }).toISOString(),
  })
  declare dateStart: Date

  @column({
    consume: (value: string) => new Date(value),
    prepare: (value: Date) => dayjs(value, { utc: true }).toISOString(),
  })
  declare dateEnd: Date

  @column()
  declare electionType: ElectionType

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(election: Election) {
    election.id = randomUUID()
  }
}
