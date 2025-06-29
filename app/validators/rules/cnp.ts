import { getAge } from '#shared/functions/dates'
import vine from '@vinejs/vine'

const lengthRegex = /^\d{13}$/
const controlKey = '279146358279'

interface Options {
  minAge?: number
}

function breakdown(cnp: string) {
  const [century, year, month, day] = [
    Number(cnp.slice(0, 1)),
    Number(cnp.slice(1, 3)),
    Number(cnp.slice(3, 5)),
    Number(cnp.slice(5, 7)),
  ]

  let fullYear: number | null = null
  switch (century) {
    case 1:
    case 2:
      fullYear = 1900 + year
      break
    case 3:
    case 4:
      fullYear = 1800 + year
      break
    case 5:
    case 6:
      fullYear = 2000 + year
      break
  }

  return { century, year, month, day, fullYear }
}

function validateChecksum(cnp: string) {
  const digits = cnp.split('').map(Number)
  const digitsSum = digits.slice(0, 12).reduce((sum, currentDigit, index) => {
    const controlKeyDigit = Number(controlKey[index])
    const multiplied = currentDigit * controlKeyDigit
    return sum + multiplied
  }, 0)
  const checksum = digitsSum % 11
  const expected = checksum === 10 ? 1 : checksum
  const lastDigit = digits.at(-1)

  return lastDigit === expected
}

function validateCenturyDigit(cnp: string) {
  const { fullYear } = breakdown(cnp)

  return Boolean(fullYear)
}

function determineAge(cnp: string) {
  const { fullYear, month, day } = breakdown(cnp)

  if (!fullYear) return null

  const birthDate = new Date(fullYear, month - 1, day)
  return getAge(birthDate)
}

function validateAge(cnp: string, minAge: number) {
  const age = determineAge(cnp)

  return age && age >= minAge
}

export const cnpRule = vine.createRule((value, options: Options = {}, field) => {
  if (typeof value !== 'string') {
    return
  }

  const trimmedValue = value.trim()
  const passesLength = lengthRegex.test(trimmedValue)

  if (!passesLength) {
    field.report('CNP must be exaclty 13 digits', 'cnp', field)
    return
  }

  if (!validateChecksum(trimmedValue)) {
    field.report('CNP is invalid (checksum mismatch)', 'cnp', field)
    return
  }

  if (!validateCenturyDigit(trimmedValue)) {
    field.report('CNP century digit is invalid', 'cnp', field)
    return
  }

  if (options.minAge && !validateAge(trimmedValue, options.minAge)) {
    field.report(`Invalid age. Minimum age is ${options.minAge}`, 'cnp', field)
  }
})
