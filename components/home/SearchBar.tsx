'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import Dropdown from '@/components/ui/Dropdown'

const PRICE_RANGES = [
  { label: 'Any Price', min: '', max: '' },
  { label: 'Under $500K', min: '', max: '500000' },
  { label: '$500K – $1M', min: '500000', max: '1000000' },
  { label: '$1M – $2M', min: '1000000', max: '2000000' },
  { label: '$2M+', min: '2000000', max: '' },
]

const TYPE_OPTIONS = [
  { value: '', label: 'Any Type' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'house', label: 'House' },
]

const BED_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
]

const LISTING_OPTIONS = [
  { value: '', label: 'Sale or Rent' },
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
]

const PRICE_OPTIONS = PRICE_RANGES.map((r, i) => ({
  value: String(i),
  label: r.label,
}))

export default function SearchBar() {
  const router = useRouter()
  const [city, setCity] = useState('')
  const [type, setType] = useState('')
  const [priceIdx, setPriceIdx] = useState('0')
  const [bedrooms, setBedrooms] = useState('')
  const [priceType, setPriceType] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (type) params.set('type', type)
    if (bedrooms) params.set('bedrooms', bedrooms)
    if (priceType) params.set('priceType', priceType)
    const range = PRICE_RANGES[parseInt(priceIdx)]
    if (range?.min) params.set('priceMin', range.min)
    if (range?.max) params.set('priceMax', range.max)
    router.push(`/properties?${params.toString()}`)
  }

  const cell =
    'rounded-[12px] px-4 py-2.5 transition-colors hover:bg-cream-dark/60'

  return (
    <section className="relative z-40 bg-cream pb-2 pt-14">
      <div className="container-content">
        <div className="mx-auto mb-6 max-w-5xl">
          <span className="eyebrow">Begin Your Search</span>
          <h2 className="mt-2 font-playfair text-2xl text-heading md:text-3xl">
            Find your sanctuary
          </h2>
        </div>
        <form
          onSubmit={handleSearch}
          className="mx-auto max-w-5xl rounded-[20px] border border-line bg-surface p-2.5 shadow-card"
        >
        <div className="grid grid-cols-1 items-center gap-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_0.8fr_1fr_auto]">
          {/* City */}
          <div className={cell}>
            <span className="eyebrow mb-1.5 block">Location</span>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="shrink-0 text-sand" />
              <input
                type="text"
                placeholder="Search by city…"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent text-sm text-heading placeholder:text-muted focus:outline-none"
              />
            </div>
          </div>

          <div className={cell}>
            <Dropdown
              label="Property Type"
              value={type}
              options={TYPE_OPTIONS}
              onChange={setType}
            />
          </div>

          <div className={cell}>
            <Dropdown
              label="Price Range"
              value={priceIdx}
              options={PRICE_OPTIONS}
              onChange={setPriceIdx}
            />
          </div>

          <div className={cell}>
            <Dropdown
              label="Beds"
              value={bedrooms}
              options={BED_OPTIONS}
              onChange={setBedrooms}
            />
          </div>

          <div className={cell}>
            <Dropdown
              label="Listing"
              value={priceType}
              options={LISTING_OPTIONS}
              onChange={setPriceType}
            />
          </div>

          {/* Search */}
          <button
            type="submit"
            className="flex h-full min-h-[52px] items-center justify-center gap-2 rounded-[14px] bg-bark px-7 text-sm font-medium text-white transition-colors hover:bg-bark-mid dark:bg-sand dark:text-bark dark:hover:bg-[#d4bd99]"
          >
            <Search size={17} />
            Search
          </button>
        </div>
        </form>
      </div>
    </section>
  )
}
