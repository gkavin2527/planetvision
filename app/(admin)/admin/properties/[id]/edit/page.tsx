import Link from 'next/link'
import { notFound } from 'next/navigation'
import PropertyForm from '@/components/admin/PropertyForm'
import { getProperty } from '@/lib/queries'

export default async function EditPropertyPage({
  params,
}: {
  params: { id: string }
}) {
  const property = await getProperty(params.id)
  if (!property) notFound()

  return (
    <div>
      <Link
        href="/admin/properties"
        className="text-sm text-muted transition-colors hover:text-bark"
      >
        ← Back to Properties
      </Link>
      <h1 className="mt-4 font-playfair text-3xl text-heading">Edit Property</h1>
      <p className="mt-1 text-sm text-muted">{property.title}</p>
      <div className="mt-8">
        <PropertyForm property={property} />
      </div>
    </div>
  )
}
