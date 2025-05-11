import { IMAGE_MIME_TYPE } from '#shared/constants/files'
import { ROUTES } from '#shared/constants/routes'
import { Avatar, Button, Card, Center, Divider, Skeleton, Text, Title } from '@mantine/core'
import { Dropzone, FileRejection, FileWithPath } from '@mantine/dropzone'
import { notifications } from '@mantine/notifications'
import { FormEvent, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { LogoWithTitle } from '~/app/components/ui/logo'
import { useCitizenAuthenticationContext } from '~/app/features/citizen/authentication/providers'
import { useDetectFaceInImage } from '~/app/features/face_api/hooks/use_detect_face_in_image'
import { cn } from '~/app/functions'
import { flattenFileRejections } from '~/app/functions/files'
import { useLocalFileURL } from '~/app/hooks/use_local_file_url'

export function CitizenAuthenticationUploadID() {
  const { t } = useTranslation()
  const { form } = useCitizenAuthenticationContext()
  const { data, setData, post, processing, setError, errors } = form

  const imageRef = useRef<HTMLImageElement | null>(null)
  const imageUrl = useLocalFileURL({ file: data.file })
  const detectFace = useDetectFaceInImage({ imageRef, label: 'citizen' })

  useEffect(() => {
    console.group('@@@')
    console.log('descriptor', detectFace.descriptor)
    console.log('imageUrl', imageUrl)
    console.groupEnd()

    function analyzeDescriptor() {
      if (!imageUrl || detectFace.descriptor === undefined) {
        return
      }

      if (detectFace.descriptor === null) {
        // setData('file', null)
        setError('file', t('citizen.authentication.errors.face_not_found'))
        return
      }

      setError('file', '')
    }

    analyzeDescriptor()
  }, [detectFace.descriptor, imageUrl])

  function onDrop(files: FileWithPath[]) {
    const [file] = files
    console.log('file', file)

    if (!file) {
      notifications.show({
        title: t('common.error'),
        message: t('common.no_file_added'),
        color: 'red',
      })
      return
    }

    setError('file', '')
    setData('file', file)
  }

  function onReject(fileRejections: FileRejection[]) {
    const error = flattenFileRejections(fileRejections).join('\n')

    notifications.show({
      title: t('common.error'),
      message: error,
      color: 'red',
    })
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    post(ROUTES.citizen.authentication.index.absolutePath, {
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
  }

  return (
    <Center h="100vh">
      {imageUrl && (
        <img
          ref={imageRef}
          src={imageUrl}
          className="sr-only"
          onLoad={detectFace.onImageLoad}
          aria-hidden
        />
      )}

      <Card withBorder padding="0" shadow="sm" className="w-full max-w-[28rem]">
        <LogoWithTitle logoSize={40} textSize="lg" className="px-8 py-4" />

        <Divider />

        <div className="px-8 py-4 space-y-4">
          <div className="space-y-4">
            <Title size="xl">{t('citizen.authentication.title')}</Title>
            <div className="space-y-2">
              <Text size="sm">{t('citizen.authentication.description_1')}</Text>
              <Text size="sm">{t('citizen.authentication.description_2')}</Text>
            </div>
          </div>

          <form onSubmit={onSubmit} className="flex items-end space-y-4 flex-col w-full">
            <div className="space-y-1 w-full">
              <Dropzone
                id="id-upload"
                accept={IMAGE_MIME_TYPE}
                multiple={false}
                radius="md"
                className="relative overflow-hidden w-full group"
                loading={Boolean(imageUrl && detectFace.descriptor === undefined)}
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

              {errors.file && (
                <Text c="red" size="sm">
                  {errors.file}
                </Text>
              )}
            </div>

            <Button type="submit" disabled={Boolean(!data.file || errors.file || processing)}>
              {t('common.submit')}
            </Button>
          </form>
        </div>
      </Card>
    </Center>
  )
}
