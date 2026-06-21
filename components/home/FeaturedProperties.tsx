'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { staggerContainer, viewportOnce } from '@/lib/animations'
import SectionHeading from '@/components/ui/SectionHeading'
import PropertyCard from '@/components/properties/PropertyCard'
import { cn } from '@/lib/utils'
import type { Property } from '@/types'

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'sale', label: 'For Sale' },
  { key: 'rent', label: 'For Rent' },
] as const

export default function FeaturedProperties({
  properties,
}: {
  properties: Property[]
}) {
  const [tab, setTab] = useState<(typeof tabs)[number]['key']>('all')

  const filtered = properties.filter((p) =>
    tab === 'all' ? true : p.price_type === tab
  )

  return (
    <section className="py-24 md:py-32">
      <div className="container-content">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Featured Listings"
            title="Handpicked Luxury Residences"
            description="A curated selection of our most exceptional properties, chosen for their design, location, and timeless appeal."
          />
          <div className="flex shrink-0 gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  'rounded-full px-5 py-2 text-sm transition-colors',
                  tab === t.key
                    ? 'bg-bark text-white'
                    : 'border border-sand text-body hover:border-bark'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-16 text-center text-muted">
            No featured properties available right now.
          </p>
        ) : (
          <motion.div
            key={tab}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
          >
            {filtered.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </motion.div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-medium text-heading transition-colors hover:text-sand"
          >
            View All Properties <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
