import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'votes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('revoked').defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, async (table) => {
      const hasCol = await this.schema.hasColumn(this.tableName, 'rekoved')
      if (!hasCol) return
      table.dropColumn('revoked')
    })
  }
}
