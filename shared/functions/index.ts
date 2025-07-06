/**
 * Shuffles the items of an array.
 * @param input The input array.
 * @returns Randomized array.
 */
export function shuffle<T>(input: T[]) {
  const array = [...input]

  for (let i = array.length - 1; i > 0; i--) {
    // pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1))

    // swap elements array[i] and array[j]
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function removeDiacritics(text: string): string {
  if (!text) return ''

  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.substring(1, text.length).toLowerCase()
}

export function pascalCase(text: string) {
  return text
    .split(' ')
    .map((part) => {
      return part.split('-').map(capitalize).join('-')
    })
    .join(' ')
}
