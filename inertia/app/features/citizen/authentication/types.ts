import { CitizenAuthStep } from '#shared/constants/citizens'
import { LivenessChallenge } from '#shared/constants/liveness'
import { PageProps } from '@adonisjs/inertia/types'

export interface Props extends PageProps {
  step: CitizenAuthStep
  challenges?: LivenessChallenge[]
}
