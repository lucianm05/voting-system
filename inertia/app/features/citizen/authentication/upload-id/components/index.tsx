import { IMAGE_MIME_TYPE } from '#shared/constants/files'
import { Routes } from '#shared/constants/routes'
import { usePage } from '@inertiajs/react'
import { Avatar, Button, Center, Skeleton, Text, Title } from '@mantine/core'
import { Dropzone, FileRejection, FileWithPath } from '@mantine/dropzone'
import { notifications } from '@mantine/notifications'
import { FormEvent, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useCitizenAuthenticationContext } from '~/app/features/citizen/authentication/providers'
import { Props } from '~/app/features/citizen/authentication/types'
import { useDetectFaceInImage } from '~/app/features/face_api/hooks/use_detect_face_in_image'
import { cn } from '~/app/shared/functions'
import { flattenFileRejections } from '~/app/shared/functions/files'
import { useLocalFileURL } from '~/app/shared/hooks/use_local_file_url'
import { CardWithLogo } from '~/app/shared/ui/card-with-logo'

export function CitizenAuthenticationUploadID() {
  const { t } = useTranslation()
  const { form } = useCitizenAuthenticationContext()
  const { data, setData, post, get, processing, setError, errors } = form

  const {
    props: { ocrData },
  } = usePage<Props>()

  const imageRef = useRef<HTMLImageElement | null>(null)
  const imageUrl = useLocalFileURL({ file: data.file })
  const detectFace = useDetectFaceInImage({ imageRef, label: 'citizen' })

  const descriptorUnavailable = Boolean(imageUrl && detectFace.descriptor === undefined)
  const hasErrors = Object.values(errors).some(Boolean)
  const isDisabled = Boolean(!data.file || hasErrors || processing || descriptorUnavailable)

  useEffect(() => {
    function analyzeDescriptor() {
      if (!imageUrl || detectFace.descriptor === undefined) {
        return
      }

      if (detectFace.descriptor === null) {
        setError('file', t('citizen.authentication.errors.face_not_found'))
        return
      }

      resetErrors()
    }

    analyzeDescriptor()
  }, [detectFace.descriptor, imageUrl])

  function resetErrors() {
    Object.keys(errors).forEach((key) => setError(key as keyof typeof errors, ''))
  }

  function onDrop(files: FileWithPath[]) {
    const [file] = files

    if (!file) {
      setError('file', t('common.no_file_added'))
      return
    }

    resetErrors()
    setData('file', file)
  }

  function onReject(fileRejections: FileRejection[]) {
    const error = flattenFileRejections(fileRejections).join('\n')
    setError('file', error)
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isDisabled) return

    if (!ocrData) {
      post(Routes.citizen.authentication.index.absolutePath, {
        onError: (errors) => {
          if (typeof errors.file === 'string') {
            notifications.show({
              title: t('common.error'),
              message: errors.file,
              color: 'red',
            })
          }
        },
      })
      return
    }

    get(Routes.citizen.authentication.index.absolutePath, { preserveState: true })
  }

  return (
    <Center className="min-h-screen py-4">
      {imageUrl && (
        <img
          ref={imageRef}
          src={imageUrl}
          className="sr-only"
          onLoad={detectFace.onImageLoad}
          aria-hidden
        />
      )}

      <CardWithLogo>
        <div className="px-4 py-4 space-y-4 md:px-8">
          <div className="space-y-2">
            <Title size="xl">{t('citizen.authentication.upload_ci.title')}</Title>
            <div className="space-y-2">
              <Text size="sm">{t('citizen.authentication.upload_ci.description_1')}</Text>
              <Text size="sm">{t('citizen.authentication.upload_ci.description_2')}</Text>
            </div>
          </div>

          <form onSubmit={onSubmit} className="flex items-end space-y-6 flex-col w-full">
            <div className="space-y-2 w-full">
              <Dropzone
                id="id-upload"
                accept={IMAGE_MIME_TYPE}
                multiple={false}
                radius="md"
                className="relative overflow-hidden w-full group"
                loading={descriptorUnavailable}
                onDrop={onDrop}
                onReject={onReject}
                aria-required
                aria-errormessage={errors.file}
              >
                {!imageUrl && (
                  <div className="flex space-x-2 opacity-30">
                    <Avatar size="xl" radius="md" />

                    <div className="flex flex-col space-y-1 w-full">
                      <Skeleton className="w-3/4 h-4" />
                      <Skeleton className="w-2/4 h-3" />
                      <Skeleton className="w-full h-2" />
                      <Skeleton className="w-full h-2" />
                      <Skeleton className="w-full h-2" />
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    'absolute w-full h-full top-0 left-0 flex items-center justify-center text-center px-16 py-2 flex-col space-y-1 z-[1] transition-opacity duration-300',
                    imageUrl && 'opacity-0 group-hover:opacity-100 bg-zinc-100/85',
                    !imageUrl && 'bg-zinc-100/50'
                  )}
                >
                  <Text size="sm" fw={500}>
                    {t('common.drag_image_here_or_press_to_select_file')}
                  </Text>
                  <Text size="xs" fw={500}>
                    {t('common.only_one_image_allowed')}
                  </Text>
                </div>

                {imageUrl && (
                  <div className="w-full min-h-[12.5rem] relative">
                    <img
                      src={imageUrl}
                      alt="Citizen identity card"
                      className="absolute w-full h-full top-0 left-0 object-contain object-center"
                    />
                  </div>
                )}
              </Dropzone>

              {errors &&
                Object.entries(errors).map(([key, error]) => (
                  <Text key={key} c="red" size="sm">
                    {error}
                  </Text>
                ))}
            </div>

            {ocrData && (
              <div>
                <Text size="sm" fw={500}>
                  {t('citizen.authentication.upload_ci.info_extracted_from_ci')}
                </Text>
                {Object.entries(ocrData).map(([key, info]) => (
                  <Text key={key} size="sm">
                    <span className="font-medium">{t(`common.${key}`)}: </span>
                    <span>{info}</span>
                  </Text>
                ))}
              </div>
            )}

            <Button type="submit" disabled={isDisabled} loading={processing}>
              {ocrData ? t('common.next_step') : t('common.submit')}
            </Button>
          </form>
        </div>
      </CardWithLogo>
    </Center>
  )
}
