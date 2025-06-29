import vine from '@vinejs/vine'

export const idValidityRule = vine.createRule((value, _, field) => {
  if (typeof value !== 'string') {
    return
  }

  const trimmedValue = value.trim()
  const [start, end] = trimmedValue.split('-')

  if (!start || !end) {
    field.report('Validity format is invalid', 'validity', field)
    return
  }

  const endParts = end.split('.')
  const [day, month, year] = [Number(endParts[0]), Number(endParts[1]), Number(endParts[2])]
  const endDate = new Date(year, month - 1, day)

  if (!endDate.getTime()) {
    field.report('Validity end date is invalid', 'validity', field)
    return
  }

  const today = new Date()

  if (endDate < today) {
    field.report('Identity card is expired', 'validity', field)
  }
})
