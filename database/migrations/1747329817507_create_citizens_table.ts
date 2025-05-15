import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'citizens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id', { primaryKey: true })
      table.text('identity').notNullable()
      table.uuid('last_vote_id').references('votes.id').onDelete('SET NULL')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
