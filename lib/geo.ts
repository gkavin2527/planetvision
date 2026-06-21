import type { Property } from '@/types'

/**
 * The listings carry a city but no lat/lng, so we approximate a location
 * from the city centre and spread homes deterministically around it (so
 * the same property always lands in the same spot). This keeps the map
 * useful without a geocoding service; swap in real coordinates later by
 * adding latitude/longitude columns and preferring them in coordsFor().
 */
export const CITY_COORDS: Record<string, [number, number]> = {
  miami: [25.7617, -80.1918],
  'los angeles': [34.0522, -118.2437],
  'new york': [40.7128, -74.006],
  chicago: [41.8781, -87.6298],
  houston: [29.7604, -95.3698],
  'san francisco': [37.7749, -122.4194],
  seattle: [47.6062, -122.3321],
  austin: [30.2672, -97.7431],
  boston: [42.3601, -71.0589],
  dallas: [32.7767, -96.797],
}

export const US_CENTER: [number, number] = [39.5, -98.35]

/** Stable 0..1 pseudo-random from a string (FNV-1a hash). */
function hash01(str: string, salt = ''): number {
  let h = 2166136261
  const s = str + salt
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  // map to 0..1
  return ((h >>> 0) % 100000) / 100000
}

/** Approximate [lat, lng] for a property, spread ~±0.07° around its city so
 *  multiple same-city listings don't stack on a single point. */
export function coordsFor(p: Pick<Property, 'id' | 'city'>): [number, number] {
  const base = CITY_COORDS[p.city.trim().toLowerCase()] ?? US_CENTER
  const jLat = (hash01(p.id, 'lat') - 0.5) * 0.14
  const jLng = (hash01(p.id, 'lng') - 0.5) * 0.14
  return [base[0] + jLat, base[1] + jLng]
}

/** Center + zoom that frames a set of properties. */
export function frameFor(
  properties: Pick<Property, 'id' | 'city'>[]
): { center: [number, number]; zoom: number } {
  if (properties.length === 0) return { center: US_CENTER, zoom: 4 }
  const pts = properties.map(coordsFor)
  const lats = pts.map((p) => p[0])
  const lngs = pts.map((p) => p[1])
  const center: [number, number] = [
    (Math.min(...lats) + Math.max(...lats)) / 2,
    (Math.min(...lngs) + Math.max(...lngs)) / 2,
  ]
  const cities = new Set(properties.map((p) => p.city.toLowerCase()))
  // One city → street-ish zoom; multiple → country/region view.
  const zoom = cities.size <= 1 ? 11 : 4
  return { center, zoom }
}
