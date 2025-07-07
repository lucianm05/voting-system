import Election from '#models/election'
import CandidatesService from '#services/candidates_service'
import CitizensService from '#services/citizens_service'
import ElectionsService from '#services/elections_service'
import VotesService from '#services/votes_service'
import { FlashMessageTypes } from '#shared/constants/flash_messages'
import { Routes } from '#shared/constants/routes'
import { isElectionActive } from '#shared/functions/elections'
import { createElectionValidator } from '#validators/elections'
import { type HttpContext } from '@adonisjs/core/http'

export default class ElectionController {
  async renderAdminIndex({ inertia }: HttpContext) {
    const elections = await Election.query().orderBy('createdAt', 'asc')

    return inertia.render(Routes.admin.elections.index.view, { elections })
  }

  async renderEdit({ params, inertia }: HttpContext) {
    const { id } = params
    const election = await Election.findOrFail(id)

    return inertia.render(Routes.admin.elections.id.view, { election })
  }

  async renderCitizensIndex({ inertia }: HttpContext) {
    const elections = await Election.query().orderBy('createdAt', 'asc')
    const [activeElections, futureElections, endedElections] = await Promise.all([
      ElectionsService.findActiveElections(),
      ElectionsService.findFutureElections(),
      ElectionsService.findEndedElections(),
    ])

    return inertia.render(Routes.citizen.elections.index.view, {
      elections,
      activeElections,
      futureElections,
      endedElections,
    })
  }

  async renderVote({ params, session, inertia, response, i18n }: HttpContext) {
    const { id } = params
    const election = await Election.findOrFail(id)

    const isActive = isElectionActive(election)
    if (!isActive) {
      session.flash('election_not_active', {
        type: FlashMessageTypes.warning,
        message: i18n.t('citizen.dashboard.elections.election_not_active'),
      })

      return response.redirect().toPath(Routes.citizen.elections.index.absolutePath)
    }

    const citizenLocation = await CitizensService.sessionData.getLocation(session)
    const candidates = await CandidatesService.findElectionCandidates({ election, citizenLocation })

    return inertia.render(Routes.citizen.elections.vote.view, {
      election,
      candidates: candidates || [],
    })
  }

  async renderVerifyVote({ inertia, params, auth, response, session, i18n }: HttpContext) {
    const { id } = params
    const citizen = auth.use('citizen').getUserOrFail()
    const election = await Election.findOrFail(id)

    const canVerify = await VotesService.canVerifyVote({ citizen, electionId: election.id })
    if (!canVerify) {
      session.flash('verify_vote', {
        type: FlashMessageTypes.warning,
        message: i18n.t('citizen.dashboard.verify_vote.limit_exceeded'),
      })

      return response.redirect().toRoute(Routes.citizen.elections.index.absolutePath)
    }

    const candidate = await VotesService.verifyVote({ citizen, electionId: election.id })

    return inertia.render(Routes.citizen.elections.verifyVote.view, { election, candidate })
  }

  /**
   * Handle form submission for the create action
   */
  async create({ request, response, session, i18n }: HttpContext) {
    const payload = await request.validateUsing(createElectionValidator)
    await Election.create(payload)

    session.flash('edit_election', {
      type: FlashMessageTypes.success,
      message: i18n.t('elections.election_created_successfully'),
    })

    return response.redirect().toRoute(Routes.admin.elections.index.absolutePath)
  }

  async edit({ params, request, response, session, i18n }: HttpContext) {
    const { id } = params
    const payload = await request.validateUsing(createElectionValidator)
    await Election.updateOrCreate({ id }, { ...payload })

    session.flash('edit_election', {
      type: FlashMessageTypes.success,
      message: i18n.t('elections.election_updated_successfully'),
    })

    return response.redirect().toRoute(Routes.admin.elections.index.absolutePath)
  }

  async delete({ params, response, session, i18n }: HttpContext) {
    const { id } = params

    await Election.query().delete().where({ id })

    session.flash('delete_election', {
      type: FlashMessageTypes.success,
      message: i18n.t('elections.election_deleted_successfully'),
    })

    return response.redirect().toRoute(Routes.admin.elections.index.absolutePath)
  }
}
