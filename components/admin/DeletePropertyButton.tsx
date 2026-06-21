'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function DeletePropertyButton({ id }: { id: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('Delete this property? This cannot be undone.')) return
    setDeleting(true)
    const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      setDeleting(false)
      window.alert('Failed to delete property.')
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-sm p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      aria-label="Delete property"
    >
      <Trash2 size={16} />
    </button>
  )
}
