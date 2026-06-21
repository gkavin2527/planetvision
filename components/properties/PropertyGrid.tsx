'use client'

import { motion } from 'framer-motion'
import { staggerContainer } from '@/lib/animations'
import PropertyCard from '@/components/properties/PropertyCard'
import type { Property } from '@/types'

export function PropertyGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-card bg-surface shadow-card"
        >
          <div className="aspect-[4/3] animate-pulse bg-cream-dark" />
          <div className="space-y-3 p-6">
            <div className="h-6 w-1/2 animate-pulse rounded bg-cream-dark" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-cream-dark" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-cream-dark" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function PropertyGrid({
  properties,
}: {
  properties: Property[]
}) {
  if (properties.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-sand bg-white/50 py-24 text-center">
        <p className="font-playfair text-2xl text-heading">No properties found</p>
        <p className="mt-2 text-sm text-muted">
          Try adjusting your filters to see more results.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-2 xl:grid-cols-3"
    >
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </motion.div>
  )
}
