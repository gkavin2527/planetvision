'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const FALLBACK = ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200']

export default function PropertyGallery({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const gallery = images?.length ? images : FALLBACK
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const go = (dir: number) => {
    setActive((prev) => (prev + dir + gallery.length) % gallery.length)
  }

  return (
    <div>
      <button
        onClick={() => setLightbox(true)}
        className="relative block aspect-[16/10] w-full overflow-hidden rounded-card"
      >
        <Image
          src={gallery[active]}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
      </button>

      {gallery.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {gallery.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={cn(
                'relative aspect-[4/3] overflow-hidden rounded-sm ring-offset-2 transition',
                active === i ? 'ring-2 ring-bark' : 'opacity-70 hover:opacity-100'
              )}
            >
              <Image
                src={img}
                alt={`${title} ${i + 1}`}
                fill
                sizes="20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-bark/95 p-4"
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute right-5 top-5 text-white/80 hover:text-white"
              onClick={() => setLightbox(false)}
              aria-label="Close"
            >
              <X size={28} />
            </button>

            {gallery.length > 1 && (
              <>
                <button
                  className="absolute left-5 text-white/80 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    go(-1)
                  }}
                  aria-label="Previous"
                >
                  <ChevronLeft size={36} />
                </button>
                <button
                  className="absolute right-5 text-white/80 hover:text-white sm:right-16"
                  onClick={(e) => {
                    e.stopPropagation()
                    go(1)
                  }}
                  aria-label="Next"
                >
                  <ChevronRight size={36} />
                </button>
              </>
            )}

            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative h-[80vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={gallery[active]}
                alt={title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
