import { CITIZEN_AUTH_STEPS } from '#shared/constants/citizens'
import { CitizenAuthenticationProvider } from '~/app/features/citizen/authentication/providers'
import { Props } from '~/app/features/citizen/authentication/types'
import { CitizenAuthenticationUploadID } from '~/app/features/citizen/authentication/upload-id/components'
import { CitizenAuthenticationValidation } from '~/app/features/citizen/authentication/validation/components'
import { FaceApiProvider } from '~/app/features/face_api/providers'

export default function CitizenAuthentication({ step }: Props) {
  return (
    <main className="px-4 w-full min-h-screen">
      <FaceApiProvider>
        <CitizenAuthenticationProvider>
          {step === CITIZEN_AUTH_STEPS.uploadID && <CitizenAuthenticationUploadID />}
          {step === CITIZEN_AUTH_STEPS.validation && <CitizenAuthenticationValidation />}
        </CitizenAuthenticationProvider>
      </FaceApiProvider>
    </main>
  )
}
