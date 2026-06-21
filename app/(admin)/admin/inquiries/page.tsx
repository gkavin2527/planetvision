import { getInquiries } from '@/lib/queries'
import InquiriesTable from '@/components/admin/InquiriesTable'

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries()

  return (
    <div>
      <h1 className="font-playfair text-3xl text-heading">Inquiries</h1>
      <p className="mt-1 text-sm text-muted">
        {inquiries.length} total · click a row for full details
      </p>
      <div className="mt-8">
        <InquiriesTable inquiries={inquiries} />
      </div>
    </div>
  )
}
