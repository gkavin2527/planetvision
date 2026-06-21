'use client'

import { useCallback, useEffect, useState } from 'react'
import { toLite, type PropertyLite } from '@/lib/property-lite'

// Re-export so client components can keep importing from one place.
export { toLite }
export type { PropertyLite }

export const KEYS = {
  favorites: 'pv:favorites',
  recent: 'pv:recent',
  compare: 'pv:compare',
} as const

const EVENT = 'pv:store-change'

function read(key: string): PropertyLite[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as PropertyLite[]) : []
  } catch {
    return []
  }
}

function write(key: string, items: PropertyLite[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(items))
    // Notify every hook instance (this tab) + other tabs handle 'storage'.
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { key } }))
  } catch {
    /* quota / private mode — ignore */
  }
}

/**
 * Subscribe a component to a localStorage-backed list. Returns the items
 * plus a setter that persists and broadcasts the change.
 */
function useStore(key: string): [PropertyLite[], (next: PropertyLite[]) => void] {
  const [items, setItems] = useState<PropertyLite[]>([])

  useEffect(() => {
    setItems(read(key))
    const sync = (e: Event) => {
      if ((e as CustomEvent).detail?.key && (e as CustomEvent).detail.key !== key)
        return
      setItems(read(key))
    }
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [key])

  const set = useCallback(
    (next: PropertyLite[]) => {
      setItems(next)
      write(key, next)
    },
    [key]
  )

  return [items, set]
}

/** Saved homes (the heart toggle). */
export function useFavorites() {
  const [items, set] = useStore(KEYS.favorites)
  const has = useCallback((id: string) => items.some((p) => p.id === id), [items])
  const toggle = useCallback(
    (p: PropertyLite) =>
      set(has(p.id) ? items.filter((x) => x.id !== p.id) : [p, ...items]),
    [items, has, set]
  )
  const remove = useCallback(
    (id: string) => set(items.filter((x) => x.id !== id)),
    [items, set]
  )
  return { items, has, toggle, remove, count: items.length }
}

/** Recently-viewed (most-recent first, capped). */
export function useRecentlyViewed(max = 8) {
  const [items, set] = useStore(KEYS.recent)
  const add = useCallback(
    (p: PropertyLite) =>
      set([p, ...items.filter((x) => x.id !== p.id)].slice(0, max)),
    [items, set, max]
  )
  return { items, add }
}

/** Compare tray (max 3, like Zillow's compare). */
export function useCompare(max = 3) {
  const [items, set] = useStore(KEYS.compare)
  const has = useCallback((id: string) => items.some((p) => p.id === id), [items])
  const toggle = useCallback(
    (p: PropertyLite) => {
      if (has(p.id)) return set(items.filter((x) => x.id !== p.id))
      if (items.length >= max) return // full — ignore
      set([...items, p])
    },
    [items, has, set, max]
  )
  const remove = useCallback(
    (id: string) => set(items.filter((x) => x.id !== id)),
    [items, set]
  )
  const clear = useCallback(() => set([]), [set])
  return {
    items,
    has,
    toggle,
    remove,
    clear,
    count: items.length,
    isFull: items.length >= max,
    max,
  }
}
