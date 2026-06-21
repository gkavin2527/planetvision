import Link from 'next/link'
import Image from 'next/image'
import { Building2, Star, Mail, BellDot, Pencil } from 'lucide-react'
import {
  getDashboardStats,
  getInquiries,
  getAllPropertiesAdmin,
  getCurrentProfile,
} from '@/lib/queries'
import { formatPrice, formatDate, cn } from '@/lib/utils'

const statusTone: Record<string, string> = {
  new: 'bg-emerald-100 text-emerald-800',
  contacted: 'bg-amber-100 text-amber-800',
  closed: 'bg-gray-200 text-gray-700',
}

export default async function AdminDashboard() {
  const [stats, inquiries, properties, profile] = await Promise.all([
    getDashboardStats(),
    getInquiries(),
    getAllPropertiesAdmin(),
    getCurrentProfile(),
  ])

  const cards = [
    { label: 'Total Properties', value: stats.totalProps, icon: Building2 },
    { label: 'Featured', value: stats.featuredProps, icon: Star },
    { label: 'Total Inquiries', value: stats.totalInquiries, icon: Mail },
    { label: 'New Inquiries', value: stats.newInquiries, icon: BellDot },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-playfair text-3xl text-heading">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            Overview of your properties and inquiries.
          </p>
        </div>
        {profile && (
          <div className="text-right">
            <p className="text-sm text-heading">
              Signed in as {profile.email}
            </p>
            <span className="mt-1 inline-flex items-center rounded-full bg-sand/20 px-2.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-[0.1em] text-sand">
              Role: {profile.role}
            </span>
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-card bg-surface p-6 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.1em] text-muted">
                {c.label}
              </span>
              <c.icon size={18} className="text-sand" />
            </div>
            <p className="mt-3 font-playfair text-4xl text-heading">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-2">
        {/* Recent inquiries */}
        <section className="rounded-card bg-surface p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-playfair text-xl text-heading">Recent Inquiries</h2>
            <Link
              href="/admin/inquiries"
              className="text-sm text-sand hover:underline"
            >
              View all
            </Link>
          </div>
          {inquiries.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              No inquiries yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-cream-dark text-xs uppercase tracking-[0.08em] text-muted">
                    <th className="py-3 pr-4 font-medium">Name</th>
                    <th className="py-3 pr-4 font-medium">Property</th>
                    <th className="py-3 pr-4 font-medium">Date</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.slice(0, 5).map((inq) => (
                    <tr key={inq.id} className="border-b border-cream-dark/60">
                      <td className="py-3 pr-4">
                        <p className="text-heading">{inq.name}</p>
                        <p className="text-xs text-muted">{inq.email}</p>
                      </td>
                      <td className="py-3 pr-4 text-body">
                        {inq.property?.title ?? '—'}
                      </td>
                      <td className="py-3 pr-4 text-muted">
                        {formatDate(inq.created_at)}
                      </td>
                      <td className="py-3">
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-1 text-xs capitalize',
                            statusTone[inq.status]
                          )}
                        >
                          {inq.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Recent properties */}
        <section className="rounded-card bg-surface p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-playfair text-xl text-heading">
              Recent Properties
            </h2>
            <Link
              href="/admin/properties"
              className="text-sm text-sand hover:underline"
            >
              View all
            </Link>
          </div>
          {properties.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              No properties yet.
            </p>
          ) : (
            <div className="space-y-4">
              {properties.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-4">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-sm bg-cream-dark">
                    {p.images?.[0] && (
                      <Image
                        src={p.images[0]}
                        alt={p.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-heading">{p.title}</p>
                    <p className="text-xs text-muted">
                      {formatPrice(p.price, p.price_type)} · {p.city}
                    </p>
                  </div>
                  <Link
                    href={`/admin/properties/${p.id}/edit`}
                    className="rounded-sm p-2 text-muted transition-colors hover:bg-cream-dark hover:text-bark"
                  >
                    <Pencil size={16} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
