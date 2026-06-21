import { cn } from '@/lib/utils'

type Tone = 'sale' | 'rent' | 'featured' | 'available' | 'sold' | 'rented' | 'neutral'

const toneClass: Record<Tone, string> = {
  sale: 'bg-bark text-white',
  rent: 'bg-white text-bark',
  featured: 'bg-sand text-bark',
  available: 'bg-emerald-100 text-emerald-800',
  sold: 'bg-red-100 text-red-800',
  rented: 'bg-amber-100 text-amber-800',
  neutral: 'bg-cream-dark text-body',
}

export default function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: Tone
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.1em]',
        toneClass[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
