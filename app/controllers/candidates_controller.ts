import Candidate from '#models/candidate'
import Election from '#models/election'
import UATService from '#services/uats_service'
import { FlashMessageTypes } from '#shared/constants/flash_messages'
import { Routes } from '#shared/constants/routes'
import { getRoute } from '#shared/functions/routes'
import { createCandidateValidator, getCandidatesValidator } from '#validators/candidates'
import type { HttpContext } from '@adonisjs/core/http'

export default class CandidatesController {
  /**
   * Display a list of resource
   */
  async renderAdminIndex({ request, inertia }: HttpContext) {
    const { electionId } = await request.validateUsing(getCandidatesValidator)

    return inertia.render(Routes.admin.candidates.index.view, {
      elections: () => {
        return Election.query().orderBy('createdAt', 'asc')
      },
      candidates: () => {
        if (!electionId) return []
        return Candidate.query()
          .where('electionId', electionId)
          .orderBy('county', 'asc')
          .orderBy('locality', 'asc')
          .orderBy('name', 'asc')
      },
    })
  }

  async renderCreate({ request, inertia }: HttpContext) {
    return inertia.render(Routes.admin.candidates.create.view, {
      elections: () => Election.query().orderBy('createdAt', 'asc'),
      counties: inertia.optional(() => {
        return UATService.getCounties()
      }),
      localities: inertia.optional(() => {
        const { autoCode } = request.only(['autoCode'])
        return UATService.getLocalitiesForElectionsByAutoCode(autoCode)
      }),
    })
  }

  async renderEdit({ params, request, inertia }: HttpContext) {
    const { id } = params
    const { autoCode } = request.only(['autoCode'])
    const candidate = await Candidate.findOrFail(id)

    return inertia.render(Routes.admin.candidates.id.view, {
      candidate,
      elections: () => Election.query().orderBy('createdAt', 'asc'),
      counties: () => UATService.getCounties(),
      localities: () =>
        UATService.getLocalitiesForElectionsByAutoCode(autoCode || candidate.county),
    })
  }

  async create({ request, response, session, i18n }: HttpContext) {
    const payload = await request.validateUsing(createCandidateValidator)
    const election = await Election.findOrFail(payload.electionId)

    const candidate = await Candidate.create({
      name: payload.name,
      type: payload.type,
      electionId: payload.electionId,
      county: payload.county,
      locality: payload.locality,
    })

    await candidate.related('election').associate(election)

    session.flash('create_candidate', {
      type: FlashMessageTypes.success,
      message: i18n.t('candidates.candidate_created_successfully'),
    })

    return response
      .redirect()
      .toPath(
        getRoute(
          Routes.admin.candidates.create.absolutePath,
          {},
          { electionId: payload.electionId, autoCode: payload.county }
        )
      )
  }

  async edit({ params, request, response, session, i18n }: HttpContext) {
    const { id } = params
    const payload = await request.validateUsing(createCandidateValidator)
    const candidate = await Candidate.updateOrCreate({ id }, { ...payload })

    session.flash('edit_candidate', {
      type: FlashMessageTypes.success,
      message: i18n.t('candidates.candidate_updated_successfully'),
    })

    return response
      .redirect()
      .toPath(
        getRoute(
          Routes.admin.candidates.index.absolutePath,
          {},
          { electionId: candidate?.electionId }
        )
      )
  }

  async delete({ params, response, session, i18n }: HttpContext) {
    const { id } = params

    const candidate = await Candidate.find(id)
    await Candidate.query().delete().where({ id })

    session.flash('delete_candidate', {
      type: FlashMessageTypes.success,
      message: i18n.t('candidates.candidate_deleted_successfully'),
    })

    return response
      .redirect()
      .toPath(
        getRoute(
          Routes.admin.candidates.index.absolutePath,
          {},
          { electionId: candidate?.electionId }
        )
      )
  }
}
