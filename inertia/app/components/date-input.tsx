import { DateInputProps, DateInput as MantineDateInput } from '@mantine/dates'
import { DATE_FORMAT } from '~/app/constants'

export function DateInput(props: DateInputProps) {
  return <MantineDateInput valueFormat={DATE_FORMAT} {...props} />
}
