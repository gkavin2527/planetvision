import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Pagination({
  page,
  pages,
  searchParams,
}: {
  page: number
  pages: number
  searchParams: Record<string, string | undefined>
}) {
  if (pages <= 1) return null

  const buildHref = (p: number) => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== 'page') params.set(k, v)
    })
    params.set('page', String(p))
    return `/properties?${params.toString()}`
  }

  const numbers = Array.from({ length: pages }, (_, i) => i + 1)

  return (
    <nav className="mt-14 flex items-center justify-center gap-2">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full border border-sand text-heading transition-colors hover:bg-bark hover:text-white',
          page === 1 && 'pointer-events-none opacity-40'
        )}
      >
        <ChevronLeft size={18} />
      </Link>

      {numbers.map((n) => (
        <Link
          key={n}
          href={buildHref(n)}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors',
            n === page
              ? 'bg-bark text-white'
              : 'border border-sand text-heading hover:bg-cream-dark'
          )}
        >
          {n}
        </Link>
      ))}

      <Link
        href={buildHref(Math.min(pages, page + 1))}
        aria-disabled={page === pages}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full border border-sand text-heading transition-colors hover:bg-bark hover:text-white',
          page === pages && 'pointer-events-none opacity-40'
        )}
      >
        <ChevronRight size={18} />
      </Link>
    </nav>
  )
}
