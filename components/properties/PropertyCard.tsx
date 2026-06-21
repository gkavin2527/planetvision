'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, BedDouble, Bath, Maximize } from 'lucide-react'
import { fadeInUp } from '@/lib/animations'
import { formatPrice, propertyTypeLabel } from '@/lib/utils'
import { estimatedMonthly, money } from '@/lib/finance'
import Badge from '@/components/ui/Badge'
import FavoriteButton from '@/components/properties/FavoriteButton'
import CompareToggle from '@/components/properties/CompareToggle'
import type { Property } from '@/types'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'

export default function PropertyCard({ property }: { property: Property }) {
  const image = property.images?.[0] || FALLBACK_IMAGE

  return (
    <motion.article variants={fadeInUp} className="h-full">
      <Link
        href={`/properties/${property.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-card transition-all duration-500 ease-luxe hover:-translate-y-1 hover:shadow-card-hover"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-luxe group-hover:scale-[1.03]"
          />
          <div className="absolute left-4 top-4">
            <Badge tone={property.price_type === 'rent' ? 'rent' : 'sale'}>
              {property.price_type === 'rent' ? 'For Rent' : 'For Sale'}
            </Badge>
          </div>
          {property.featured && (
            <div className="absolute left-4 top-14">
              <Badge tone="featured">Featured</Badge>
            </div>
          )}
          {/* Save + compare actions */}
          <div className="absolute right-4 top-4 flex gap-2">
            <CompareToggle property={property} overlay />
            <FavoriteButton property={property} overlay />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-playfair text-2xl text-heading">
              {formatPrice(property.price, property.price_type)}
            </p>
            {property.price_type === 'sale' && (
              <p className="shrink-0 text-xs text-muted">
                Est. {money(estimatedMonthly(property.price))}/mo
              </p>
            )}
          </div>
          <h3 className="mt-2 line-clamp-2 font-playfair text-lg text-heading transition-colors group-hover:text-bark-mid">
            {property.title}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <MapPin size={14} className="shrink-0 text-sand" />
            <span className="truncate">{property.city}</span>
          </p>

          {/* Stats — equal thirds so figures always line up, never wrap */}
          <div className="mt-auto grid grid-cols-3 divide-x divide-cream-dark border-t border-cream-dark pt-4 text-body">
            <span className="flex items-center justify-center gap-1.5 whitespace-nowrap text-[13px]">
              <BedDouble size={15} className="shrink-0 text-sand" />
              {property.bedrooms} bd
            </span>
            <span className="flex items-center justify-center gap-1.5 whitespace-nowrap text-[13px]">
              <Bath size={15} className="shrink-0 text-sand" />
              {property.bathrooms} ba
            </span>
            <span className="flex items-center justify-center gap-1.5 whitespace-nowrap text-[13px]">
              <Maximize size={15} className="shrink-0 text-sand" />
              {property.area.toLocaleString('en-US')} ft²
            </span>
          </div>

          <p className="mt-4 text-xs uppercase tracking-[0.1em] text-muted">
            {propertyTypeLabel(property.property_type)}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}
