'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X, GitCompareArrows } from 'lucide-react'
import { useCompare } from '@/lib/property-store'
import { formatPrice, formatArea, propertyTypeLabel } from '@/lib/utils'
import { estimatedMonthly, pricePerSqft, money } from '@/lib/finance'

export default function ComparePage() {
  const { items, remove, clear } = useCompare()

  const rows: { label: string; render: (p: (typeof items)[number]) => string }[] = [
    { label: 'Price', render: (p) => formatPrice(p.price, p.price_type) },
    {
      label: 'Est. payment',
      render: (p) =>
        p.price_type === 'sale' ? `${money(estimatedMonthly(p.price))}/mo` : '—',
    },
    { label: 'Bedrooms', render: (p) => String(p.bedrooms) },
    { label: 'Bathrooms', render: (p) => String(p.bathrooms) },
    { label: 'Living area', render: (p) => formatArea(p.area) },
    {
      label: 'Price / sq ft',
      render: (p) => `$${pricePerSqft(p.price, p.area).toFixed(0)}`,
    },
    { label: 'Type', render: (p) => propertyTypeLabel(p.property_type) },
    { label: 'City', render: (p) => p.city },
    { label: 'Location', render: (p) => p.location },
  ]

  return (
    <>
      <section className="bg-bark pb-16 pt-32">
        <div className="container-content flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow !text-sand">Side by Side</span>
            <h1 className="mt-3 font-playfair text-hero !text-white">Compare Homes</h1>
          </div>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="shrink-0 text-sm text-white/60 transition-colors hover:text-white"
            >
              Clear all
            </button>
          )}
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container-content">
          {items.length === 0 ? (
            <div className="rounded-card border border-dashed border-sand bg-surface py-24 text-center">
              <GitCompareArrows className="mx-auto text-sand" size={32} />
              <p className="mt-4 font-playfair text-2xl text-heading">
                Nothing to compare yet
              </p>
              <p className="mt-2 text-sm text-muted">
                Add up to 3 homes using the compare icon on any listing.
              </p>
              <Link href="/properties" className="btn-primary mt-6">
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr>
                    <th className="w-40" />
                    {items.map((p) => (
                      <th key={p.id} className="p-3 text-left align-top">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-card">
                          <Image src={p.image} alt={p.title} fill sizes="280px" className="object-cover" />
                          <button
                            onClick={() => remove(p.id)}
                            aria-label="Remove"
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-surface/90 text-heading shadow-card backdrop-blur"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <Link
                          href={`/properties/${p.id}`}
                          className="mt-3 block font-playfair text-lg text-heading hover:text-bark-mid"
                        >
                          {p.title}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.label} className={i % 2 ? 'bg-cream-dark/50' : ''}>
                      <td className="p-3 align-top text-xs uppercase tracking-[0.1em] text-muted">
                        {row.label}
                      </td>
                      {items.map((p) => (
                        <td key={p.id} className="p-3 align-top text-sm text-heading">
                          {row.render(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
