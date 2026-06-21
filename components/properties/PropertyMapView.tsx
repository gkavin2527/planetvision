'use client'

import dynamic from 'next/dynamic'
import type { Property } from '@/types'

// Leaflet touches `window`, so load the map only on the client.
const PropertyMap = dynamic(() => import('./PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[640px] w-full items-center justify-center rounded-card bg-cream-dark">
      <p className="text-sm text-muted">Loading map…</p>
    </div>
  ),
})

export default function PropertyMapView({
  properties,
}: {
  properties: Property[]
}) {
  if (properties.length === 0) {
    return (
      <div className="flex h-[640px] w-full items-center justify-center rounded-card border border-dashed border-sand bg-surface">
        <p className="text-sm text-muted">No properties to map. Try widening your filters.</p>
      </div>
    )
  }
  return <PropertyMap properties={properties} />
}
