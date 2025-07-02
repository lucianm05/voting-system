import Citizen from '#models/citizen'
import UATService from '#services/uats_service'
import { LivenessChallenges } from '#shared/constants/liveness'
import { removeDiacritics, shuffle } from '#shared/functions/index'
import { County } from '#shared/types/index'
import env from '#start/env'
import { cnpValidator, identityCardValidator } from '#validators/citizens'
import { Encryption } from '@adonisjs/core/encryption'
import { Session } from '@adonisjs/session'
import { AllowedSessionValues } from '@adonisjs/session/types'
import { createHash } from 'node:crypto'
import { WithTransaction } from '../types.js'

interface SaveLastVotePayload {
  citizen: Citizen
  electionId: string
  voteId: string
}

interface GetLastVotePayload {
  citizen: Citizen
  electionId: string
}

export default class CitizensService {
  private static encryption = new Encryption({
    secret: env.get('CITIZEN_LAST_VOTES_ENCRYPTION_SECRET'),
  })

  static sessionData = {
    /**
     * "All" data will be used to determine the step rendered in the authentication flow. If the data is missing, it means the user must begin the authentication from the first step, uploading the CI. If there is data, it means the user passed the first step and the CI was validated, therefore they can continue with validating their identity using the web camera.
     */
    setAll(session: Session, data: AllowedSessionValues) {
      session.put('citizenData', data)
    },
    async pullAll(session: Session) {
      const data = session.pull('citizenData')
      const [, validatedData] = await identityCardValidator.tryValidate(data)
      return validatedData
    },

    /**
     * We are using the CNP to detemine if the user passed the identity validation and to login them.
     */
    setCNP(session: Session, cnp: string) {
      session.put('cnp', cnp)
    },
    async pullCNP(session: Session) {
      const data = session.pull('cnp')
      const [, validatedData] = await cnpValidator.tryValidate(data)
      return validatedData
    },

    /**
     * We are using the address to show the citizen the corresponding candidates for local/county elections.
     */
    setAddress(session: Session, address: string) {
      session.put('address', address)
    },
    getAddress(session: Session) {
      const data = session.get('address')
      if (!data) return null
      return data
    },
  }

  static generateChallenges() {
    const nonFaceMatchChallenges = Object.values(LivenessChallenges).filter(
      (challenge) => challenge !== LivenessChallenges.faceMatch
    )
    const shuffledChallenges = shuffle(nonFaceMatchChallenges)
    const challenges = [LivenessChallenges.faceMatch, ...shuffledChallenges]

    return challenges
  }

  /**
   * Creates a deterministic "identity" for the user, which can be saved in the database and used to search for the citizen.
   */
  static async createIdentity(cnp: string) {
    const identity = createHash('sha256')
      .update(`${env.get('APP_KEY')}_${cnp}`)
      .digest('hex')

    return identity
  }

  private static encryptVotesMap(payload: Record<string, string>) {
    return this.encryption.encrypt(payload)
  }

  private static decryptVotesMap(citizen: Citizen): Record<string, string> | null {
    return this.encryption.decrypt(citizen.votesMap)
  }

  static async saveLastVoteId(payload: SaveLastVotePayload, options?: WithTransaction) {
    const { citizen, electionId, voteId } = payload

    const decryptedVotesMap = CitizensService.decryptVotesMap(citizen)
    const newVotesMap = {
      ...decryptedVotesMap,
      [electionId]: voteId,
    }
    const encryptedVotesMap = CitizensService.encryptVotesMap(newVotesMap)

    return Citizen.updateOrCreate({ id: citizen.id }, { votesMap: encryptedVotesMap }, options)
  }

  static getLastVoteId(payload: GetLastVotePayload) {
    const decryptedPayload = CitizensService.decryptVotesMap(payload.citizen)
    if (!decryptedPayload) return null

    const voteId = decryptedPayload[payload.electionId]

    return voteId || null
  }

  /**
   * Finds the citizen's county and locality based on their CI address.
   */
  static async findLocation(ciAddress: string) {
    function searchable(input: string) {
      return removeDiacritics(input).replace(/\s/g, '').toLowerCase()
    }

    async function findLocationInBucharest() {
      const [sectorString = ''] = normalizedAddress.match(/sec\.\d/) || []
      const [sectorNumber = ''] = sectorString.match(/\d/) || []

      if (!sectorNumber) return null

      const sectors = await UATService.getLocalitiesByAutoCode('B')
      const county: County = { auto: 'B', nume: 'București', localitati: [] }
      const locality = sectors.find((s) => s.nume.includes(sectorNumber))

      return { county: county || null, locality: locality || null }
    }

    const normalizedAddress = searchable(ciAddress)

    if (normalizedAddress.includes('bucuresti')) {
      return await findLocationInBucharest()
    }

    const counties = await UATService.getCounties()
    const county = counties.find(
      (c) =>
        normalizedAddress.includes(searchable(`Jud.${c.auto}`)) ||
        normalizedAddress.includes(searchable(`Jud.${c.nume}`))
    )

    const localities = county ? await UATService.getLocalitiesByAutoCode(county.auto) : []
    const locality = localities.find((l) => {
      if (l.comuna) {
        return (
          normalizedAddress.includes(searchable(`Com.${l.comuna}`)) &&
          normalizedAddress.includes(searchable(l.nume))
        )
      }

      return normalizedAddress.includes(searchable(l.nume))
    })

    return { county: county || null, locality: locality || null }
  }
}
