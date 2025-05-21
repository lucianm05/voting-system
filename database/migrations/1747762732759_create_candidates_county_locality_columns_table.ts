import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'candidates'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('county')
      table.string('locality')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('county')
      table.dropColumn('locality')
    })
  }
}
