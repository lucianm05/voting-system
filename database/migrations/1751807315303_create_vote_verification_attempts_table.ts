import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vote_verification_attempts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id', { primaryKey: true })
      table.uuid('vote_id').references('votes.id')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
