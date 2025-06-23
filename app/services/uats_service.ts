import { County } from '#shared/types/index'
import logger from '@adonisjs/core/services/logger'
import fs from 'node:fs/promises'
import path from 'node:path'

export default class UATService {
  private static uats: County[] = []

  private static async initUats() {
    if (!this.uats.length) {
      try {
        const fileContents = await fs.readFile(
          path.join(process.cwd(), 'resources', 'judete.json'),
          'utf-8'
        )
        this.uats = JSON.parse(fileContents).judete
      } catch (err) {
        logger.error(err, `Error initializing uats: ${err.message}`)
      }
    }
  }

  static async getCounties() {
    await this.initUats()

    const counties = this.uats.map((uat) => ({ ...uat, localitati: [] }))

    return counties || []
  }

  static async getCountyByAutoCode(autoCode: string) {
    await this.initUats()

    const county = this.uats.find((uat) => uat.auto === autoCode)

    return county || null
  }

  static async getLocalitiesByAutoCode(autoCode: string) {
    await this.initUats()

    const county = await this.getCountyByAutoCode(autoCode)

    if (!county) return []

    const localities = county.localitati.sort((l1, l2) => l1.nume.localeCompare(l2.nume))

    return localities
  }
}
