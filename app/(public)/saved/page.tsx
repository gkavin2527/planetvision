'use client'

import Link from 'next/link'
import { Heart, Clock } from 'lucide-react'
import { useFavorites, useRecentlyViewed } from '@/lib/property-store'
import LitePropertyCard from '@/components/properties/LitePropertyCard'

export default function SavedPage() {
  const { items: favorites, remove } = useFavorites()
  const { items: recent } = useRecentlyViewed()

  return (
    <>
      <section className="bg-bark pb-16 pt-32">
        <div className="container-content">
          <span className="eyebrow !text-sand">Your Collection</span>
          <h1 className="mt-3 font-playfair text-hero !text-white">Saved Homes</h1>
          <p className="mt-4 max-w-xl text-lg font-light text-white/70">
            Homes you&apos;ve hearted, kept right here on this device.
          </p>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container-content">
          {favorites.length === 0 ? (
            <div className="rounded-card border border-dashed border-sand bg-surface py-24 text-center">
              <Heart className="mx-auto text-sand" size={32} />
              <p className="mt-4 font-playfair text-2xl text-heading">
                No saved homes yet
              </p>
              <p className="mt-2 text-sm text-muted">
                Tap the heart on any listing to save it for later.
              </p>
              <Link href="/properties" className="btn-primary mt-6">
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((p) => (
                <LitePropertyCard key={p.id} p={p} onRemove={() => remove(p.id)} />
              ))}
            </div>
          )}

          {recent.length > 0 && (
            <div className="mt-20">
              <h2 className="flex items-center gap-2 font-playfair text-h2 text-heading">
                <Clock size={22} className="text-sand" />
                Recently Viewed
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {recent.map((p) => (
                  <LitePropertyCard key={p.id} p={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
