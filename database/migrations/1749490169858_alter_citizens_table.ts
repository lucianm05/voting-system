import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'citizens'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('last_vote_id')
      table.text('votes_map')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.uuid('last_vote_id').references('votes.id').onDelete('SET NULL')
      table.dropColumn('votes_map')
    })
  }
}
