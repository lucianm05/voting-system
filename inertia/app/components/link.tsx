import { Link as InertiaLink, InertiaLinkProps } from '@inertiajs/react'
import { NavLink, NavLinkProps } from '@mantine/core'

interface Props extends Omit<InertiaLinkProps, 'onChange'>, Pick<NavLinkProps, 'onChange'> {
  label: string
}

function getHref(props: Props) {
  if (typeof props.href === 'string') return props.href
  return props.href.url
}

function getMethod(props: Props) {
  if (typeof props.href === 'string') return 'get'
  return props.href.method
}

export function Link(props: Props) {
  return (
    <NavLink {...props} component={InertiaLink} href={getHref(props)} method={getMethod(props)}>
      {props.children}
    </NavLink>
  )
}
