import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Check,
  Waves,
  Dumbbell,
  Car,
  Wifi,
  Wind,
  Trees,
  Flame,
  ShieldCheck,
  Phone,
  Mail,
} from 'lucide-react'
import { getProperty, getSimilarProperties, getComparables } from '@/lib/queries'
import { formatPrice, formatArea, propertyTypeLabel } from '@/lib/utils'
import { estimatedMonthly, pricePerSqft, estimateValue, money } from '@/lib/finance'
import { toLite } from '@/lib/property-lite'
import Badge from '@/components/ui/Badge'
import PropertyGallery from '@/components/properties/PropertyGallery'
import PropertyCard from '@/components/properties/PropertyCard'
import FavoriteButton from '@/components/properties/FavoriteButton'
import ShareButton from '@/components/properties/ShareButton'
import CompareToggle from '@/components/properties/CompareToggle'
import ContactTourTabs from '@/components/properties/ContactTourTabs'
import RecentlyViewedTracker from '@/components/properties/RecentlyViewedTracker'
import MortgageCalculator from '@/components/tools/MortgageCalculator'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const property = await getProperty(params.id)
  if (!property) return { title: 'Property Not Found' }
  return {
    title: property.title,
    description: property.description.slice(0, 155),
  }
}

const amenityIcon: Record<string, typeof Check> = {
  pool: Waves,
  'infinity pool': Waves,
  spa: Waves,
  gym: Dumbbell,
  parking: Car,
  'valet parking': Car,
  valet: Car,
  'garage': Car,
  wifi: Wifi,
  'smart home': Wifi,
  'air conditioning': Wind,
  garden: Trees,
  fireplace: Flame,
  concierge: ShieldCheck,
  doorman: ShieldCheck,
}

function iconFor(amenity: string) {
  const key = amenity.toLowerCase()
  for (const [name, Icon] of Object.entries(amenityIcon)) {
    if (key.includes(name)) return Icon
  }
  return Check
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const property = await getProperty(params.id)
  if (!property) notFound()

  const [similar, comps] = await Promise.all([
    getSimilarProperties(property.city, property.id, 3),
    getComparables(property.city, property.property_type, property.id),
  ])
  const mapQuery = encodeURIComponent(`${property.location}, ${property.city}`)

  const estimate = estimateValue(property.area, comps)
  const ppsf = pricePerSqft(property.price, property.area)
  const monthly = estimatedMonthly(property.price, property.price_type)

  return (
    <>
      <RecentlyViewedTracker lite={toLite(property)} />
      <div className="pt-28 pb-20">
        <div className="container-content">
          <Link
            href="/properties"
            className="text-sm text-muted transition-colors hover:text-bark"
          >
            ← Back to Properties
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr]">
            {/* LEFT */}
            <div>
              <PropertyGallery images={property.images} title={property.title} />

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Badge tone={property.price_type === 'rent' ? 'rent' : 'sale'}>
                  {property.price_type === 'rent' ? 'For Rent' : 'For Sale'}
                </Badge>
                <Badge tone="neutral">
                  {propertyTypeLabel(property.property_type)}
                </Badge>
                {property.featured && <Badge tone="featured">Featured</Badge>}
              </div>

              <h1 className="mt-4 font-playfair text-h2 text-heading">
                {property.title}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-muted">
                <MapPin size={16} className="text-sand" />
                {property.location}, {property.city}
              </p>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1">
                <p className="font-playfair text-4xl text-heading">
                  {formatPrice(property.price, property.price_type)}
                </p>
                {property.price_type === 'sale' && (
                  <p className="text-sm text-muted">
                    Est. {money(monthly)}/mo · ${ppsf.toFixed(0)}/sq ft
                  </p>
                )}
              </div>

              {/* Save / share / compare */}
              <div className="mt-5 flex flex-wrap gap-3">
                <FavoriteButton property={property} />
                <ShareButton title={property.title} />
                <CompareToggle property={property} />
              </div>

              {/* Stats bar */}
              <div className="mt-8 flex flex-wrap gap-8 rounded-card bg-cream-dark px-8 py-6">
                <div className="flex items-center gap-3">
                  <BedDouble className="text-sand" size={22} />
                  <div>
                    <p className="font-playfair text-xl text-heading">
                      {property.bedrooms}
                    </p>
                    <p className="text-xs uppercase tracking-[0.1em] text-muted">
                      Bedrooms
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="text-sand" size={22} />
                  <div>
                    <p className="font-playfair text-xl text-heading">
                      {property.bathrooms}
                    </p>
                    <p className="text-xs uppercase tracking-[0.1em] text-muted">
                      Bathrooms
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Maximize className="text-sand" size={22} />
                  <div>
                    <p className="font-playfair text-xl text-heading">
                      {formatArea(property.area)}
                    </p>
                    <p className="text-xs uppercase tracking-[0.1em] text-muted">
                      Living Area
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-10">
                <h2 className="font-playfair text-2xl text-heading">Description</h2>
                <p className="mt-4 text-lg font-light leading-relaxed text-body">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-playfair text-2xl text-heading">Amenities</h2>
                  <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {property.amenities.map((a) => {
                      const Icon = iconFor(a)
                      return (
                        <div
                          key={a}
                          className="flex items-center gap-3 rounded-sm border border-cream-dark bg-surface px-4 py-3 text-sm text-body"
                        >
                          <Icon size={18} className="text-sand" />
                          {a}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* PlanetVision Estimate (comparable-based) */}
              {property.price_type === 'sale' && estimate && (
                <div className="mt-10 rounded-card border border-line bg-cream-dark p-8">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <span className="eyebrow">PlanetVision Estimate</span>
                      <p className="mt-1 font-playfair text-4xl text-heading">
                        {money(estimate.value)}
                      </p>
                    </div>
                    <div className="text-right text-sm text-body">
                      <p>
                        List price{' '}
                        <span className="font-medium text-heading">
                          {money(property.price)}
                        </span>
                      </p>
                      <p
                        className={
                          property.price <= estimate.value
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }
                      >
                        {property.price <= estimate.value ? 'Below' : 'Above'} estimate by{' '}
                        {money(Math.abs(property.price - estimate.value))}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-muted">
                    A transparent estimate from the median price per sq ft of{' '}
                    {estimate.sampleSize} comparable {property.city} listings (≈ $
                    {estimate.ppsf.toFixed(0)}/sq ft). Not an appraisal.
                  </p>
                </div>
              )}

              {/* Payment calculator */}
              {property.price_type === 'sale' && (
                <div className="mt-10">
                  <h2 className="font-playfair text-2xl text-heading">
                    Estimate Your Payment
                  </h2>
                  <div className="mt-5">
                    <MortgageCalculator initialPrice={property.price} compact />
                  </div>
                </div>
              )}

              {/* Map */}
              <div className="mt-10">
                <h2 className="font-playfair text-2xl text-heading">Location</h2>
                <div className="mt-5 overflow-hidden rounded-card">
                  <iframe
                    title="Property location map"
                    width="100%"
                    height="360"
                    loading="lazy"
                    className="border-0"
                    src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT — sticky */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-card bg-surface p-8 shadow-card">
                <h3 className="font-playfair text-2xl text-heading">
                  Schedule a viewing
                </h3>
                <p className="mt-2 text-sm text-muted">
                  Pick a time for a private tour, or ask us anything.
                </p>
                <div className="mt-6">
                  <ContactTourTabs
                    propertyId={property.id}
                    propertyTitle={property.title}
                  />
                </div>
              </div>

              {/* Agent */}
              <div className="mt-6 rounded-card bg-cream-dark p-8">
                <div className="flex items-center gap-4">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120"
                    alt="Agent"
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-playfair text-lg text-heading">
                      Jonathan Hale
                    </p>
                    <p className="text-xs uppercase tracking-[0.1em] text-muted">
                      Senior Property Advisor
                    </p>
                  </div>
                </div>
                <div className="mt-5 space-y-3 text-sm text-body">
                  <a
                    href="tel:+13055550142"
                    className="flex items-center gap-3 hover:text-bark"
                  >
                    <Phone size={16} className="text-sand" />
                    +1 (305) 555-0142
                  </a>
                  <a
                    href="mailto:advisor@planetvision.com"
                    className="flex items-center gap-3 hover:text-bark"
                  >
                    <Mail size={16} className="text-sand" />
                    advisor@planetvision.com
                  </a>
                </div>
              </div>
            </aside>
          </div>

          {/* Similar */}
          {similar.length > 0 && (
            <div className="mt-20">
              <h2 className="font-playfair text-h2 text-heading">
                Similar Properties
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
