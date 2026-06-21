'use client'

import { Heart } from 'lucide-react'
import { useFavorites, toLite } from '@/lib/property-store'
import { cn } from '@/lib/utils'
import type { Property } from '@/types'

/**
 * Save-home heart. `overlay` = the round button that floats on a card
 * image; otherwise a pill with a label for the detail page.
 */
export default function FavoriteButton({
  property,
  overlay = false,
  className,
}: {
  property: Property
  overlay?: boolean
  className?: string
}) {
  const { has, toggle } = useFavorites()
  const saved = has(property.id)

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(toLite(property))
  }

  if (overlay) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        aria-label={saved ? 'Remove from saved homes' : 'Save home'}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-heading shadow-card backdrop-blur transition-colors hover:bg-surface',
          className
        )}
      >
        <Heart
          size={17}
          className={cn('transition-colors', saved && 'fill-red-500 text-red-500')}
        />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors',
        saved
          ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-400'
          : 'border-heading text-heading hover:bg-heading hover:text-cream',
        className
      )}
    >
      <Heart size={16} className={cn(saved && 'fill-red-500 text-red-500')} />
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}
