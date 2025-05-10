import { IMAGE_MIME_TYPE } from '#shared/constants/files'
import { ROUTES } from '#shared/constants/routes'
import { useForm } from '@inertiajs/react'
import { Avatar, Button, Card, Center, Divider, Skeleton, Text, Title } from '@mantine/core'
import { Dropzone, FileRejection, FileWithPath } from '@mantine/dropzone'
import { notifications } from '@mantine/notifications'
import { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { LogoWithTitle } from '~/app/components/ui/logo'
import { flattenFileRejections } from '~/app/functions/files'

export default function CitizenAuthentication() {
  const { t } = useTranslation()
  const { data, setData, post, processing } = useForm<{ file: File | null }>({ file: null })

  function onDrop(files: FileWithPath[]) {
    const [file] = files

    if (!file) {
      notifications.show({
        title: t('common.error'),
        message: t('common.no_file_added'),
        color: 'red',
      })
      return
    }

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

    post(ROUTES.citizen.authentication.attempt.absolutePath, {
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
    <main className="px-4">
      <Center h="100vh">
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
              <Dropzone
                accept={IMAGE_MIME_TYPE}
                multiple={false}
                radius="md"
                className="relative overflow-hidden w-full"
                onDrop={onDrop}
                onReject={onReject}
                aria-required
              >
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

                <div className="absolute w-full h-full top-0 left-0 bg-zinc-100/50 flex items-center justify-center text-center px-16 py-2 flex-col space-y-1">
                  <Text size="sm" fw={500}>
                    {t('common.drag_image_here_or_press_to_select_file')}
                  </Text>
                  <Text size="xs" fw={500}>
                    {t('common.only_one_image_allowed')}
                  </Text>
                </div>
              </Dropzone>

              <Button type="submit" disabled={!data.file || processing}>
                {t('common.submit')}
              </Button>
            </form>
          </div>
        </Card>
      </Center>
    </main>
  )
}
