import { router } from '@inertiajs/react'
import { PropsWithChildren } from 'react'

export interface PropsWithClassName {
  className?: string
}

export interface ContainerProps extends PropsWithClassName, PropsWithChildren {}

export type RouterVisitOptions = Parameters<typeof router.visit>[1]
