'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'
import { PROPERTY_TYPES } from '@/lib/utils'
import type { Property } from '@/types'

type FormState = {
  title: string
  description: string
  price: string
  price_type: 'sale' | 'rent'
  city: string
  location: string
  bedrooms: string
  bathrooms: string
  area: string
  property_type: Property['property_type']
  status: Property['status']
  featured: boolean
  images: string[]
  amenities: string[]
}

function toFormState(property?: Property): FormState {
  return {
    title: property?.title ?? '',
    description: property?.description ?? '',
    price: property?.price?.toString() ?? '',
    price_type: property?.price_type ?? 'sale',
    city: property?.city ?? '',
    location: property?.location ?? '',
    bedrooms: property?.bedrooms?.toString() ?? '',
    bathrooms: property?.bathrooms?.toString() ?? '',
    area: property?.area?.toString() ?? '',
    property_type: property?.property_type ?? 'apartment',
    status: property?.status ?? 'available',
    featured: property?.featured ?? false,
    images: property?.images ?? [],
    amenities: property?.amenities ?? [],
  }
}

export default function PropertyForm({ property }: { property?: Property }) {
  const router = useRouter()
  const isEdit = Boolean(property)
  const [form, setForm] = useState<FormState>(toFormState(property))
  const [amenityInput, setAmenityInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const addAmenity = () => {
    const value = amenityInput.trim()
    if (value && !form.amenities.includes(value)) {
      set('amenities', [...form.amenities, value])
    }
    setAmenityInput('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      title: form.title,
      description: form.description,
      price: parseFloat(form.price) || 0,
      price_type: form.price_type,
      city: form.city,
      location: form.location,
      bedrooms: parseInt(form.bedrooms) || 0,
      bathrooms: parseInt(form.bathrooms) || 0,
      area: parseFloat(form.area) || 0,
      property_type: form.property_type,
      status: form.status,
      featured: form.featured,
      images: form.images,
      amenities: form.amenities,
    }

    try {
      const res = await fetch(
        isEdit ? `/api/properties/${property!.id}` : '/api/properties',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Failed to save')
      }
      router.push('/admin/properties')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
      setSaving(false)
    }
  }

  const label = 'mb-1.5 block text-xs uppercase tracking-[0.1em] text-muted'
  const input =
    'w-full rounded-sm border border-sand bg-surface px-4 py-2.5 text-sm text-heading focus:border-bark focus:outline-none'

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <p className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div>
        <label className={label}>Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          className={input}
        />
      </div>

      <div>
        <label className={label}>Description</label>
        <textarea
          required
          rows={5}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          className={input}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>Price (USD)</label>
          <input
            required
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Listing Type</label>
          <select
            value={form.price_type}
            onChange={(e) =>
              set('price_type', e.target.value as FormState['price_type'])
            }
            className={input}
          >
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>City</label>
          <input
            required
            value={form.city}
            onChange={(e) => set('city', e.target.value)}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Location / Address</label>
          <input
            required
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
            className={input}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
        <div>
          <label className={label}>Bedrooms</label>
          <input
            required
            type="number"
            min="0"
            value={form.bedrooms}
            onChange={(e) => set('bedrooms', e.target.value)}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Bathrooms</label>
          <input
            required
            type="number"
            min="0"
            value={form.bathrooms}
            onChange={(e) => set('bathrooms', e.target.value)}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Area (sq ft)</label>
          <input
            required
            type="number"
            min="0"
            value={form.area}
            onChange={(e) => set('area', e.target.value)}
            className={input}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>Property Type</label>
          <select
            value={form.property_type}
            onChange={(e) =>
              set('property_type', e.target.value as FormState['property_type'])
            }
            className={input}
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Status</label>
          <select
            value={form.status}
            onChange={(e) =>
              set('status', e.target.value as FormState['status'])
            }
            className={input}
          >
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className={label}>Amenities</label>
        <div className="flex gap-2">
          <input
            value={amenityInput}
            onChange={(e) => setAmenityInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addAmenity()
              }
            }}
            placeholder="Type an amenity and press Enter"
            className={input}
          />
          <button type="button" onClick={addAmenity} className="btn-ghost px-4">
            Add
          </button>
        </div>
        {form.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {form.amenities.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1.5 rounded-full bg-cream-dark px-3 py-1 text-sm text-heading"
              >
                {a}
                <button
                  type="button"
                  onClick={() =>
                    set(
                      'amenities',
                      form.amenities.filter((x) => x !== a)
                    )
                  }
                  aria-label={`Remove ${a}`}
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Images */}
      <div>
        <label className={label}>Images</label>
        <ImageUploader
          images={form.images}
          onChange={(urls) => set('images', urls)}
        />
      </div>

      {/* Featured */}
      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-body">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => set('featured', e.target.checked)}
          className="h-4 w-4 accent-bark"
        />
        Mark as featured
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary disabled:opacity-60"
        >
          {saving ? 'Saving…' : isEdit ? 'Update Property' : 'Create Property'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/properties')}
          className="btn-ghost"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
