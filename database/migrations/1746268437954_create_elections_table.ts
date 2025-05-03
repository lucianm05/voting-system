import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'elections'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id', { primaryKey: true })
      table.string('name').notNullable()
      table.string('description').notNullable()
      table.timestamp('date_start').notNullable()
      table.timestamp('date_end').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
