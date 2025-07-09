import Admin from '#models/admin'
import env from '#start/env'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const email = env.get('ADMIN_EMAIL')
    const password = env.get('ADMIN_PASSWORD')

    if (!email) {
      throw new Error('ADMIN_EMAIL env is not set.')
    }

    if (!password) {
      throw new Error('ADMIN_PASSWORD env is not set.')
    }

    const exists = await Admin.findBy({ email })
    if (exists) {
      console.log('Admin exists, skipping...')
      return
    }

    await Admin.create({
      email,
      password,
      firstName: 'Lucian-George',
      lastName: 'Manea',
    })
  }
}
