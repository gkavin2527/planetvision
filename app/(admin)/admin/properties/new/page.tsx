import Link from 'next/link'
import PropertyForm from '@/components/admin/PropertyForm'

export default function NewPropertyPage() {
  return (
    <div>
      <Link
        href="/admin/properties"
        className="text-sm text-muted transition-colors hover:text-bark"
      >
        ← Back to Properties
      </Link>
      <h1 className="mt-4 font-playfair text-3xl text-heading">Add Property</h1>
      <p className="mt-1 text-sm text-muted">
        Create a new listing for your portfolio.
      </p>
      <div className="mt-8">
        <PropertyForm />
      </div>
    </div>
  )
}
