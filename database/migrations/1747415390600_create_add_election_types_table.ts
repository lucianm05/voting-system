import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'elections'

  async up() {
    this.defer(async (db) => {
      await db.from(this.tableName).delete()
    })

    this.schema.alterTable(this.tableName, (table) => {
      table
        .enum('election_type', ['local', 'county', 'parliamentary', 'presidential', 'euro'])
        .notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('election_type')
    })
  }
}
