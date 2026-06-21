'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { formatDate, truncate, cn } from '@/lib/utils'
import type { Inquiry } from '@/types'

const statuses = ['new', 'contacted', 'closed'] as const

const statusTone: Record<string, string> = {
  new: 'bg-emerald-100 text-emerald-800',
  contacted: 'bg-amber-100 text-amber-800',
  closed: 'bg-gray-200 text-gray-700',
}

export default function InquiriesTable({
  inquiries,
}: {
  inquiries: Inquiry[]
}) {
  const [rows, setRows] = useState(inquiries)
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    const prev = rows
    setRows((r) =>
      r.map((row) =>
        row.id === id ? { ...row, status: status as Inquiry['status'] } : row
      )
    )
    const res = await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) setRows(prev) // revert on failure
    setUpdating(null)
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-card bg-surface py-16 text-center shadow-card">
        <p className="text-sm text-muted">No inquiries yet.</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-card bg-surface shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-cream-dark text-xs uppercase tracking-[0.08em] text-muted">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Property</th>
                <th className="px-6 py-4 font-medium">Message</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((inq) => (
                <tr
                  key={inq.id}
                  onClick={() => setSelected(inq)}
                  className="cursor-pointer border-b border-cream-dark/60 transition-colors last:border-0 hover:bg-cream"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-heading">{inq.name}</p>
                    <p className="text-xs text-muted">{inq.email}</p>
                  </td>
                  <td className="px-6 py-4 text-body">{inq.phone || '—'}</td>
                  <td className="px-6 py-4 text-body">
                    {inq.property?.title ?? '—'}
                  </td>
                  <td className="px-6 py-4 text-body">
                    {truncate(inq.message, 80)}
                  </td>
                  <td className="px-6 py-4 text-muted">
                    {formatDate(inq.created_at)}
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={inq.status}
                      disabled={updating === inq.id}
                      onChange={(e) => updateStatus(inq.id, e.target.value)}
                      className={cn(
                        'rounded-full border-0 px-3 py-1 text-xs capitalize focus:outline-none focus:ring-1 focus:ring-bark',
                        statusTone[inq.status]
                      )}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bark/50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-lg rounded-card bg-cream p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-playfair text-2xl text-heading">
                    {selected.name}
                  </h3>
                  <p className="text-sm text-muted">{selected.email}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="text-muted hover:text-bark"
                >
                  <X size={22} />
                </button>
              </div>

              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-[0.1em] text-muted">
                    Phone
                  </dt>
                  <dd className="mt-1 text-heading">{selected.phone || '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.1em] text-muted">
                    Property
                  </dt>
                  <dd className="mt-1 text-heading">
                    {selected.property?.title ?? '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.1em] text-muted">
                    Received
                  </dt>
                  <dd className="mt-1 text-heading">
                    {formatDate(selected.created_at)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.1em] text-muted">
                    Message
                  </dt>
                  <dd className="mt-1 leading-relaxed text-body">
                    {selected.message}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex gap-3">
                <a
                  href={`mailto:${selected.email}`}
                  className="btn-primary flex-1"
                >
                  Reply via Email
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
