'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Share a listing — uses the native share sheet when available,
 * otherwise copies the link to the clipboard with a "Copied" state.
 */
export default function ShareButton({
  title,
  path,
  className,
}: {
  title: string
  path?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url =
      typeof window !== 'undefined'
        ? path
          ? `${window.location.origin}${path}`
          : window.location.href
        : ''
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* user cancelled share — no-op */
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border border-heading px-5 py-3 text-sm font-medium text-heading transition-colors hover:bg-heading hover:text-cream',
        className
      )}
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {copied ? 'Link copied' : 'Share'}
    </button>
  )
}
