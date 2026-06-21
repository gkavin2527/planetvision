'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, BedDouble, Bath, Maximize, X } from 'lucide-react'
import { formatPrice, propertyTypeLabel } from '@/lib/utils'
import { estimatedMonthly, money } from '@/lib/finance'
import Badge from '@/components/ui/Badge'
import type { PropertyLite } from '@/lib/property-store'

/** Card for a stored snapshot (saved homes / recently viewed). */
export default function LitePropertyCard({
  p,
  onRemove,
}: {
  p: PropertyLite
  onRemove?: () => void
}) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-card transition-all duration-500 ease-luxe hover:-translate-y-1 hover:shadow-card-hover">
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remove"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-heading shadow-card backdrop-blur transition-colors hover:bg-surface"
        >
          <X size={15} />
        </button>
      )}
      <Link href={`/properties/${p.id}`} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={p.image}
            alt={p.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
          />
          <div className="absolute left-4 top-4">
            <Badge tone={p.price_type === 'rent' ? 'rent' : 'sale'}>
              {p.price_type === 'rent' ? 'For Rent' : 'For Sale'}
            </Badge>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-playfair text-2xl text-heading">
              {formatPrice(p.price, p.price_type)}
            </p>
            {p.price_type === 'sale' && (
              <p className="shrink-0 text-xs text-muted">
                Est. {money(estimatedMonthly(p.price))}/mo
              </p>
            )}
          </div>
          <h3 className="mt-2 line-clamp-2 font-playfair text-lg text-heading">
            {p.title}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <MapPin size={14} className="shrink-0 text-sand" />
            <span className="truncate">{p.city}</span>
          </p>
          <div className="mt-auto grid grid-cols-3 divide-x divide-cream-dark border-t border-cream-dark pt-4 text-body">
            <span className="flex items-center justify-center gap-1.5 whitespace-nowrap text-[13px]">
              <BedDouble size={15} className="shrink-0 text-sand" />
              {p.bedrooms} bd
            </span>
            <span className="flex items-center justify-center gap-1.5 whitespace-nowrap text-[13px]">
              <Bath size={15} className="shrink-0 text-sand" />
              {p.bathrooms} ba
            </span>
            <span className="flex items-center justify-center gap-1.5 whitespace-nowrap text-[13px]">
              <Maximize size={15} className="shrink-0 text-sand" />
              {p.area.toLocaleString('en-US')} ft²
            </span>
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.1em] text-muted">
            {propertyTypeLabel(p.property_type)}
          </p>
        </div>
      </Link>
    </div>
  )
}
