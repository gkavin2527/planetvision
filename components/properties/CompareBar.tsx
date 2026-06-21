'use client'

import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { X, GitCompareArrows } from 'lucide-react'
import { useCompare } from '@/lib/property-store'

/**
 * Sticky bottom tray that collects homes added to compare and links to
 * the /compare page. Rendered once in the public layout; stays hidden
 * until at least one home is selected.
 */
export default function CompareBar() {
  const { items, remove, clear, max } = useCompare()

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-md"
        >
          <div className="container-content flex items-center gap-4 py-3">
            <span className="hidden shrink-0 items-center gap-2 text-sm font-medium text-heading sm:flex">
              <GitCompareArrows size={16} className="text-sand" />
              Compare
            </span>

            <div className="flex flex-1 items-center gap-3 overflow-x-auto no-scrollbar">
              {items.map((p) => (
                <div
                  key={p.id}
                  className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border border-line"
                >
                  <Image src={p.image} alt={p.title} fill className="object-cover" sizes="64px" />
                  <button
                    onClick={() => remove(p.id)}
                    aria-label="Remove"
                    className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-bark/80 text-white"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              {Array.from({ length: max - items.length }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-16 shrink-0 rounded-md border border-dashed border-line"
                />
              ))}
            </div>

            <button
              onClick={clear}
              className="hidden text-sm text-muted transition-colors hover:text-heading sm:block"
            >
              Clear
            </button>
            <Link
              href="/compare"
              className="shrink-0 rounded-full bg-bark px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-bark-mid dark:bg-sand dark:text-bark dark:hover:bg-[#d4bd99]"
            >
              Compare ({items.length})
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
