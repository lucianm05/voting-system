import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export interface WithTransaction {
  client: TransactionClientContract
}
