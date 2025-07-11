import { DateTimePickerProps, DateTimePicker as MantineDateTimePicker } from '@mantine/dates'
import { DATETIME_FORMAT } from '~/app/shared/constants'

export function DateTimePicker(props: DateTimePickerProps) {
  return <MantineDateTimePicker valueFormat={DATETIME_FORMAT} {...props} />
}
