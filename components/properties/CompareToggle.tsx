'use client'

import { GitCompareArrows, Check } from 'lucide-react'
import { useCompare, toLite } from '@/lib/property-store'
import { cn } from '@/lib/utils'
import type { Property } from '@/types'

/**
 * Adds/removes a property from the compare tray (max 3). `overlay` renders
 * the compact round button used on listing cards.
 */
export default function CompareToggle({
  property,
  overlay = false,
  className,
}: {
  property: Property
  overlay?: boolean
  className?: string
}) {
  const { has, toggle, isFull } = useCompare()
  const selected = has(property.id)
  const disabled = !selected && isFull

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    toggle(toLite(property))
  }

  if (overlay) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        aria-label={selected ? 'Remove from compare' : 'Add to compare'}
        title={disabled ? 'Compare up to 3 homes' : 'Compare'}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full shadow-card backdrop-blur transition-colors',
          selected
            ? 'bg-bark text-white dark:bg-sand dark:text-bark'
            : 'bg-surface/90 text-heading hover:bg-surface',
          disabled && 'cursor-not-allowed opacity-40',
          className
        )}
      >
        {selected ? <Check size={16} /> : <GitCompareArrows size={16} />}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        selected
          ? 'border-bark bg-bark text-white dark:border-sand dark:bg-sand dark:text-bark'
          : 'border-heading text-heading hover:bg-heading hover:text-cream',
        className
      )}
    >
      {selected ? <Check size={16} /> : <GitCompareArrows size={16} />}
      {selected ? 'In compare' : 'Compare'}
    </button>
  )
}
