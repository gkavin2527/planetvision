import Link from 'next/link'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ghost' | 'primary-light' | 'ghost-light'

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
  'primary-light': 'btn-primary-light',
  'ghost-light': 'btn-ghost-light',
}

type CommonProps = {
  variant?: Variant
  className?: string
  children: React.ReactNode
}

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

type ButtonAsLink = CommonProps & {
  href: string
}

export default function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'primary', className, children } = props

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} className={cn(variantClass[variant], className)}>
        {children}
      </Link>
    )
  }

  const { variant: _v, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton
  return (
    <button className={cn(variantClass[variant], className)} {...rest}>
      {children}
    </button>
  )
}
