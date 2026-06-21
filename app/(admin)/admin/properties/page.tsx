import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil } from 'lucide-react'
import { getAllPropertiesAdmin } from '@/lib/queries'
import { formatPrice, propertyTypeLabel, cn } from '@/lib/utils'
import DeletePropertyButton from '@/components/admin/DeletePropertyButton'

const statusTone: Record<string, string> = {
  available: 'bg-emerald-100 text-emerald-800',
  sold: 'bg-red-100 text-red-800',
  rented: 'bg-amber-100 text-amber-800',
}

export default async function AdminPropertiesPage() {
  const properties = await getAllPropertiesAdmin()

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-3xl text-heading">Properties</h1>
          <p className="mt-1 text-sm text-muted">
            {properties.length} total listings
          </p>
        </div>
        <Link href="/admin/properties/new" className="btn-primary">
          <Plus size={16} /> Add Property
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-card bg-surface shadow-card">
        {properties.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted">
            No properties yet. Create your first listing.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-cream-dark text-xs uppercase tracking-[0.08em] text-muted">
                  <th className="px-6 py-4 font-medium">Property</th>
                  <th className="px-6 py-4 font-medium">City</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-cream-dark/60 last:border-0"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-sm bg-cream-dark">
                          {p.images?.[0] && (
                            <Image
                              src={p.images[0]}
                              alt={p.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <span className="font-medium text-heading">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-body">{p.city}</td>
                    <td className="px-6 py-4 text-body">
                      {formatPrice(p.price, p.price_type)}
                    </td>
                    <td className="px-6 py-4 text-body">
                      {propertyTypeLabel(p.property_type)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-1 text-xs capitalize',
                          statusTone[p.status]
                        )}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/properties/${p.id}/edit`}
                          className="rounded-sm p-2 text-muted transition-colors hover:bg-cream-dark hover:text-bark"
                          aria-label="Edit property"
                        >
                          <Pencil size={16} />
                        </Link>
                        <DeletePropertyButton id={p.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
