import type { Property } from '@/types'

/**
 * Lightweight snapshot of a property persisted in localStorage so the
 * Saved / Recently-viewed / Compare pages can render without a round-trip
 * to Supabase. Lives in its own (non-"use client") module so it can be
 * called from server components too.
 */
export type PropertyLite = {
  id: string
  title: string
  price: number
  price_type: 'sale' | 'rent'
  city: string
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  property_type: string
  image: string
}

export const LITE_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'

export function toLite(p: Property): PropertyLite {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    price_type: p.price_type,
    city: p.city,
    location: p.location,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area,
    property_type: p.property_type,
    image: p.images?.[0] || LITE_FALLBACK_IMAGE,
  }
}
