type ExtractPathParams<Path extends string> =
  Path extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? Param | ExtractPathParams<`/${Rest}`>
    : Path extends `${infer _Start}:${infer Param}`
      ? Param
      : never

type PathParams<Path extends string> =
  ExtractPathParams<Path> extends never ? {} : { [K in ExtractPathParams<Path>]: string | number }

type SearchParams = Record<string, string | number | boolean | undefined | null>

export function getRoute<const Path extends string>(
  path: Path,
  params: PathParams<Path>,
  searchParams?: SearchParams
): string {
  let result = path as string
  for (const key in params) {
    result = result.replace(`:${key}`, encodeURIComponent(String(params[key])))
  }

  if (searchParams) {
    const query = new URLSearchParams()
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== null) {
        query.append(key, String(value))
      }
    }

    const queryString = query.toString()
    if (queryString) {
      result += `?${queryString}`
    }
  }

  return result
}
