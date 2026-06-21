'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, Video, MapPin, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const TIME_SLOTS = [
  '9:00 AM',
  '11:00 AM',
  '1:00 PM',
  '3:00 PM',
  '5:00 PM',
]

function nextDays(count: number) {
  const out: { value: string; weekday: string; day: number; month: string }[] = []
  const today = new Date()
  for (let i = 1; i <= count; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    out.push({
      value: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
      day: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    })
  }
  return out
}

/** "Request a Tour" panel — in-person or video, with date/time selection. */
export default function TourScheduler({
  propertyId,
  propertyTitle,
}: {
  propertyId: string
  propertyTitle: string
}) {
  const days = useMemo(() => nextDays(6), [])
  const [mode, setMode] = useState<'in-person' | 'video'>('in-person')
  const [date, setDate] = useState(days[0].value)
  const [time, setTime] = useState(TIME_SLOTS[1])
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const update =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    const prettyDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
    const message = `Tour request (${
      mode === 'video' ? 'Video chat' : 'In person'
    }) for "${propertyTitle}" on ${prettyDate} at ${time}.`
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, message, property_id: propertyId }),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-card bg-cream-dark p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sand/30">
          <Check className="text-sand" />
        </div>
        <p className="mt-4 font-playfair text-2xl text-heading">Tour requested</p>
        <p className="mt-2 text-sm text-body">
          We&apos;ll confirm your{' '}
          {mode === 'video' ? 'video tour' : 'in-person viewing'} shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Mode toggle */}
      <div className="grid grid-cols-2 gap-2 rounded-full border border-line bg-cream-dark p-1">
        {[
          { id: 'in-person', label: 'In person', Icon: MapPin },
          { id: 'video', label: 'Video chat', Icon: Video },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id as typeof mode)}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-colors',
              mode === id
                ? 'bg-bark text-white dark:bg-sand dark:text-bark'
                : 'text-body hover:text-heading'
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Date chips */}
      <div className="grid grid-cols-6 gap-2">
        {days.map((d) => (
          <button
            key={d.value}
            type="button"
            onClick={() => setDate(d.value)}
            className={cn(
              'flex flex-col items-center rounded-lg border py-2 text-center transition-colors',
              date === d.value
                ? 'border-bark bg-bark text-white dark:border-sand dark:bg-sand dark:text-bark'
                : 'border-line text-body hover:border-sand'
            )}
          >
            <span className="text-[10px] uppercase tracking-wide opacity-80">
              {d.weekday}
            </span>
            <span className="font-playfair text-lg leading-none">{d.day}</span>
          </button>
        ))}
      </div>

      {/* Time */}
      <label className="block">
        <span className="eyebrow mb-1.5 block">Preferred time</span>
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full rounded-sm border border-sand bg-surface px-3 py-2.5 text-sm text-heading focus:border-bark focus:outline-none"
        >
          {TIME_SLOTS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>

      <input
        required
        placeholder="Full name"
        value={form.name}
        onChange={update('name')}
        className="w-full rounded-sm border border-sand bg-surface px-4 py-3 text-sm text-heading placeholder:text-muted focus:border-bark focus:outline-none"
      />
      <input
        required
        type="email"
        placeholder="Email address"
        value={form.email}
        onChange={update('email')}
        className="w-full rounded-sm border border-sand bg-surface px-4 py-3 text-sm text-heading placeholder:text-muted focus:border-bark focus:outline-none"
      />
      <input
        type="tel"
        placeholder="Phone (optional)"
        value={form.phone}
        onChange={update('phone')}
        className="w-full rounded-sm border border-sand bg-surface px-4 py-3 text-sm text-heading placeholder:text-muted focus:border-bark focus:outline-none"
      />

      {status === 'error' && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary w-full disabled:opacity-60"
      >
        <CalendarDays size={16} />
        {status === 'sending' ? 'Requesting…' : 'Request this time'}
      </button>
    </form>
  )
}
