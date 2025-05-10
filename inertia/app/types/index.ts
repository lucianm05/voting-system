import { PropsWithChildren } from 'react'

export interface PropsWithClassName {
  className?: string
}

export interface ContainerProps extends PropsWithClassName, PropsWithChildren {}

export type ValueOf<T extends object> = T[keyof T]
