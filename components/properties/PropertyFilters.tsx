'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X, Search } from 'lucide-react'
import { PROPERTY_TYPES } from '@/lib/utils'
import { cn } from '@/lib/utils'

function FilterFields({ onApply }: { onApply?: () => void }) {
  const router = useRouter()
  const params = useSearchParams()

  const [keyword, setKeyword] = useState(params.get('q') ?? '')
  const [city, setCity] = useState(params.get('city') ?? '')
  const [types, setTypes] = useState<string[]>(
    params.get('type') ? [params.get('type')!] : []
  )
  const [priceMin, setPriceMin] = useState(params.get('priceMin') ?? '')
  const [priceMax, setPriceMax] = useState(params.get('priceMax') ?? '')
  const [bedrooms, setBedrooms] = useState(params.get('bedrooms') ?? '')
  const [bathrooms, setBathrooms] = useState(params.get('bathrooms') ?? '')
  const [areaMin, setAreaMin] = useState(params.get('areaMin') ?? '')
  const [priceType, setPriceType] = useState(params.get('priceType') ?? '')
  const [status, setStatus] = useState(params.get('status') ?? '')
  const [sort, setSort] = useState(params.get('sort') ?? 'newest')

  const toggleType = (value: string) => {
    setTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [value]
    )
  }

  const apply = () => {
    const next = new URLSearchParams()
    if (keyword) next.set('q', keyword)
    if (city) next.set('city', city)
    if (types[0]) next.set('type', types[0])
    if (priceMin) next.set('priceMin', priceMin)
    if (priceMax) next.set('priceMax', priceMax)
    if (bedrooms) next.set('bedrooms', bedrooms)
    if (bathrooms) next.set('bathrooms', bathrooms)
    if (areaMin) next.set('areaMin', areaMin)
    if (priceType) next.set('priceType', priceType)
    if (status) next.set('status', status)
    if (sort && sort !== 'newest') next.set('sort', sort)
    router.push(`/properties?${next.toString()}`)
    onApply?.()
  }

  const reset = () => {
    setKeyword('')
    setCity('')
    setTypes([])
    setPriceMin('')
    setPriceMax('')
    setBedrooms('')
    setBathrooms('')
    setAreaMin('')
    setPriceType('')
    setStatus('')
    setSort('newest')
    router.push('/properties')
    onApply?.()
  }

  const labelClass = 'eyebrow mb-2 block'
  const inputClass =
    'w-full rounded-sm border border-sand bg-surface px-3 py-2.5 text-sm text-heading placeholder:text-muted focus:border-bark focus:outline-none'

  return (
    <div className="space-y-6">
      <div>
        <label className={labelClass}>Keyword</label>
        <div className="flex items-center rounded-sm border border-sand bg-surface px-3 focus-within:border-bark">
          <Search size={15} className="shrink-0 text-sand" />
          <input
            type="text"
            placeholder="Pool, sea view, modern…"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            className="w-full bg-transparent px-2 py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>City</label>
        <input
          type="text"
          placeholder="Search by city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && apply()}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Property Type</label>
        <div className="space-y-2">
          {PROPERTY_TYPES.map((t) => (
            <label
              key={t.value}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-body"
            >
              <input
                type="checkbox"
                checked={types.includes(t.value)}
                onChange={() => toggleType(t.value)}
                className="h-4 w-4 accent-bark"
              />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Price ($)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className={inputClass}
          />
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Beds</label>
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className={inputClass}
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Baths</label>
          <select
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            className={inputClass}
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Min Area (sq ft)</label>
        <input
          type="number"
          placeholder="Any"
          value={areaMin}
          onChange={(e) => setAreaMin(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Listing Type</label>
        <select
          value={priceType}
          onChange={(e) => setPriceType(e.target.value)}
          className={inputClass}
        >
          <option value="">For Sale or Rent</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={inputClass}
        >
          <option value="">Any Status</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="rented">Rented</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Sort By</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className={inputClass}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="featured">Featured First</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={apply} className="btn-primary flex-1">
          Apply Filters
        </button>
        <button onClick={reset} className="btn-ghost px-4">
          Reset
        </button>
      </div>
    </div>
  )
}

export default function PropertyFilters() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="btn-ghost mb-6 w-full lg:hidden"
      >
        <SlidersHorizontal size={16} /> Filters
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="rounded-card bg-cream-dark p-6">
          <h3 className="mb-6 font-playfair text-xl text-heading">Filters</h3>
          <FilterFields />
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-bark/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-cream p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-playfair text-xl text-heading">Filters</h3>
              <button onClick={() => setOpen(false)} aria-label="Close filters">
                <X size={22} className="text-heading" />
              </button>
            </div>
            <FilterFields onApply={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
