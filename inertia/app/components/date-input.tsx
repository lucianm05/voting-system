import { DateInputProps, DateInput as MDateInput } from '@mantine/dates'

export function DateInput(props: DateInputProps) {
  return <MDateInput valueFormat="DD MMMM YYYY" {...props} />
}
