'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

export default function InquiryForm({
  propertyId,
  defaultMessage = '',
  compact = false,
}: {
  propertyId?: string
  defaultMessage?: string
  compact?: boolean
}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  )
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: defaultMessage,
  })

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          property_id: propertyId ?? null,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('sent')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full rounded-sm border border-sand bg-surface px-4 py-3 text-sm text-heading placeholder:text-muted focus:border-bark focus:outline-none'

  if (status === 'sent') {
    return (
      <div className="rounded-card bg-cream-dark p-8 text-center">
        <p className="font-playfair text-2xl text-heading">Thank you!</p>
        <p className="mt-2 text-sm text-body">
          Your inquiry has been received. Our team will be in touch shortly.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="btn-ghost mt-6"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2'}>
        <input
          required
          placeholder="Full Name"
          value={form.name}
          onChange={update('name')}
          className={inputClass}
        />
        <input
          required
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={update('email')}
          className={inputClass}
        />
      </div>
      <input
        type="tel"
        placeholder="Phone (optional)"
        value={form.phone}
        onChange={update('phone')}
        className={inputClass}
      />
      <textarea
        required
        rows={compact ? 4 : 5}
        placeholder="Your message"
        value={form.message}
        onChange={update('message')}
        className={inputClass}
      />
      {status === 'error' && (
        <p className="text-sm text-red-600">
          Something went wrong. Please try again.
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary w-full disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Send Inquiry'}
        <Send size={16} />
      </button>
    </form>
  )
}
