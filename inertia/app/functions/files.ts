import { FileRejection } from '@mantine/dropzone'

export function flattenFileRejections(fileRejections: FileRejection[]) {
  return fileRejections.flatMap((rejection) => rejection.errors.flatMap((error) => error.message))
}
