import type { Metadata } from 'next'
import { getProperties } from '@/lib/queries'
import PropertyGrid from '@/components/properties/PropertyGrid'
import PropertyFilters from '@/components/properties/PropertyFilters'
import Pagination from '@/components/properties/Pagination'
import ViewToggle from '@/components/properties/ViewToggle'
import PropertyMapView from '@/components/properties/PropertyMapView'
import type { PropertyFilters as Filters } from '@/types'

export const metadata: Metadata = {
  title: 'Properties',
  description: 'Browse our curated collection of luxury properties for sale and rent.',
}

type SearchParams = { [key: string]: string | string[] | undefined }

function param(sp: SearchParams, key: string): string | undefined {
  const v = sp[key]
  return Array.isArray(v) ? v[0] : v
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const num = (key: string) => {
    const v = param(searchParams, key)
    return v ? Number(v) : undefined
  }

  const isMap = param(searchParams, 'view') === 'map'

  const filters: Filters = {
    city: param(searchParams, 'city'),
    property_type: param(searchParams, 'type'),
    price_min: num('priceMin'),
    price_max: num('priceMax'),
    bedrooms: num('bedrooms'),
    bathrooms: num('bathrooms'),
    area_min: num('areaMin'),
    keyword: param(searchParams, 'q'),
    status: param(searchParams, 'status') as Filters['status'],
    price_type: param(searchParams, 'priceType') as Filters['price_type'],
    sort: (param(searchParams, 'sort') as Filters['sort']) ?? 'newest',
    page: num('page') ?? 1,
    // The map plots every match at once; the list paginates.
    limit: isMap ? 60 : 9,
  }

  const { properties, total, pages, page } = await getProperties(filters)

  const flatParams: Record<string, string | undefined> = {}
  Object.keys(searchParams).forEach((k) => {
    flatParams[k] = param(searchParams, k)
  })

  return (
    <>
      {/* Page header */}
      <section className="bg-bark pt-32 pb-16">
        <div className="container-content">
          <span className="eyebrow !text-sand">Our Portfolio</span>
          <h1 className="mt-3 font-playfair text-hero !text-white">
            Discover Properties
          </h1>
          <p className="mt-4 max-w-xl text-lg font-light text-white/70">
            Explore exceptional homes across the most desirable locations.
          </p>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container-content grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
          <PropertyFilters />

          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-sm text-muted">
                {total} {total === 1 ? 'property' : 'properties'} found
              </p>
              <ViewToggle />
            </div>
            {isMap ? (
              <PropertyMapView properties={properties} />
            ) : (
              <>
                <PropertyGrid properties={properties} />
                <Pagination page={page} pages={pages} searchParams={flatParams} />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
