export type ValueOf<T extends object> = T[keyof T]

export interface Locality {
  nume: string
  simplu?: string
  comuna?: string
}

export interface County {
  auto: string
  nume: string
  localitati: Locality[]
}

export interface CitizenLocation {
  county: County | null
  locality: Locality | null
}

export interface BaseDTO {
  id: string
  createdAt: string
  updatedAt: string
}
