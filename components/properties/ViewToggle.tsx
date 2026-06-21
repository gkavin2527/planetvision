'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { LayoutGrid, Map } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Switches the results between list (grid) and map view via ?view=. */
export default function ViewToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const view = params.get('view') === 'map' ? 'map' : 'list'

  const setView = (v: 'list' | 'map') => {
    const next = new URLSearchParams(params.toString())
    if (v === 'map') next.set('view', 'map')
    else next.delete('view')
    next.delete('page')
    router.push(`${pathname}?${next.toString()}`)
  }

  return (
    <div className="inline-flex rounded-full border border-line bg-surface p-1">
      {[
        { id: 'list', label: 'List', Icon: LayoutGrid },
        { id: 'map', label: 'Map', Icon: Map },
      ].map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => setView(id as 'list' | 'map')}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
            view === id
              ? 'bg-bark text-white dark:bg-sand dark:text-bark'
              : 'text-body hover:text-heading'
          )}
        >
          <Icon size={15} />
          {label}
        </button>
      ))}
    </div>
  )
}
