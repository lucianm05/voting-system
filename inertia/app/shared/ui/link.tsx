import { Link as InertiaLink, InertiaLinkProps } from '@inertiajs/react'
import { Button, ButtonProps, NavLink, NavLinkProps } from '@mantine/core'

interface LinkProps
  extends Omit<InertiaLinkProps, 'onChange' | 'onClick' | 'onKeyDown' | 'color' | 'size' | 'style'>,
    NavLinkProps {
  label: string
}

function getHref(props: LinkProps) {
  if (typeof props.href === 'string') return props.href
  return props.href.url
}

function getMethod(props: LinkProps) {
  if (typeof props.href === 'string') return 'get'
  return props.href.method
}

export function Link(props: LinkProps) {
  return (
    <NavLink {...props} component={InertiaLink} href={getHref(props)} method={getMethod(props)}>
      {props.children}
    </NavLink>
  )
}

interface ButtonLinkProps extends Omit<InertiaLinkProps, 'color' | 'size' | 'style'>, ButtonProps {}

export function ButtonLink(props: ButtonLinkProps) {
  return (
    <Button component={InertiaLink} {...props}>
      {props.children}
    </Button>
  )
}
