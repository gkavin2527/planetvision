'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { compactPrice } from '@/lib/finance'
import { coordsFor, frameFor } from '@/lib/geo'
import type { Property } from '@/types'

/** A Zillow-style price-pill marker. The root is a 0×0 anchor at the exact
 *  location; the pill auto-sizes to its label and centres itself above the
 *  point via CSS transform (see `.pv-pin` in globals.css). */
function priceIcon(price: number) {
  const label = compactPrice(price)
  return L.divIcon({
    className: 'pv-pin-root',
    html: `<div class="pv-pin">${label}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -42],
  })
}

/** Frames every marker in view with padding, so none are cut off or piled up. */
function FitBounds({ properties }: { properties: Property[] }) {
  const map = useMap()
  useEffect(() => {
    const pts = properties.map((p) => coordsFor(p)) as L.LatLngExpression[]
    if (pts.length === 0) return
    if (pts.length === 1) {
      map.setView(pts[0], 12)
      return
    }
    map.fitBounds(L.latLngBounds(pts), { padding: [60, 60], maxZoom: 13 })
  }, [map, properties])
  return null
}

export default function PropertyMap({ properties }: { properties: Property[] }) {
  const { center, zoom } = frameFor(properties)

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className="h-[640px] w-full rounded-card"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds properties={properties} />
      {properties.map((p) => (
        <Marker key={p.id} position={coordsFor(p)} icon={priceIcon(p.price)}>
          <Popup>
            <Link href={`/properties/${p.id}`} className="block w-48">
              <span className="relative block h-28 w-full overflow-hidden rounded-md">
                <Image
                  src={
                    p.images?.[0] ||
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400'
                  }
                  alt={p.title}
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              </span>
              <span className="mt-2 block font-semibold text-[#2c2416]">
                {formatPrice(p.price, p.price_type)}
              </span>
              <span className="block text-sm text-[#5c5145]">{p.title}</span>
              <span className="block text-xs text-[#9c8e7e]">
                {p.bedrooms} bd · {p.bathrooms} ba · {p.city}
              </span>
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
