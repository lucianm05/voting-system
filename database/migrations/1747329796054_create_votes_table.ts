import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'votes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id', { primaryKey: true })
      table.text('payload').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
