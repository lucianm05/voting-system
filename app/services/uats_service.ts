import { pascalCase, removeDiacritics } from '#shared/functions/index'
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
    await UATService.initUats()

    const counties = UATService.uats.map((uat) => ({ ...uat, localitati: [] }))

    return counties || []
  }

  static async getCountyByAutoCode(autoCode: string) {
    await UATService.initUats()

    const county = UATService.uats.find((uat) => uat.auto === autoCode)

    return county || null
  }

  static async getLocalitiesByAutoCode(autoCode: string) {
    await UATService.initUats()

    const county = await UATService.getCountyByAutoCode(autoCode)

    if (!county) return []

    const localities = county.localitati.sort((l1, l2) => l1.nume.localeCompare(l2.nume))

    return localities
  }

  /**
   * The localities for elections are the cities or towns, where the towns are composed of multiple localities (villages). We need to filter the villages and keep only towns and cities, because there are no elections for villages.
   */
  static async getLocalitiesForElectionsByAutoCode(autoCode: string) {
    function comparable(input: string) {
      return pascalCase(removeDiacritics(input))
    }

    const localities = await UATService.getLocalitiesByAutoCode(autoCode)
    const localitiesForElections = localities.map((l) => {
      if (l.comuna) return comparable(l.comuna)
      return comparable(l.nume)
    })
    const uniqueLocalities = [...new Set(localitiesForElections)]
    const mappedLocalities = uniqueLocalities
      .map((l) => ({ nume: l }))
      .sort((l1, l2) => l1.nume.localeCompare(l2.nume))

    return mappedLocalities
  }
}
