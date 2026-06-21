'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/animations'
import { cn } from '@/lib/utils'

type Item = { title: string; description: string; image: string }
type Category = { key: string; label: string; items: Item[] }

const categories: Category[] = [
  {
    key: 'residential',
    label: 'Residential Design',
    items: [
      {
        title: 'Residential Living Space',
        description:
          'Thoughtfully designed residential spaces that blend comfort, functionality, and modern aesthetics to enhance everyday living.',
        image:
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
      },
      {
        title: 'High-Performance Collaboration',
        description:
          'We partner with architects and craftsmen to deliver homes engineered for performance, longevity, and timeless style.',
        image:
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      },
      {
        title: 'Curated Private Art Collections',
        description:
          'Bespoke art curation that gives every residence a distinct identity and a sense of enduring cultural value.',
        image:
          'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800',
      },
      {
        title: 'Heritage Material Sourcing',
        description:
          'Rare stones, woods, and textiles sourced worldwide to bring authenticity and warmth to modern interiors.',
        image:
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
      },
    ],
  },
  {
    key: 'commercial',
    label: 'Commercial Spaces',
    items: [
      {
        title: 'Signature Living Concepts',
        description:
          'Signature concepts that deliver refined commercial interiors blending elegance, comfort, and timeless sophistication.',
        image:
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      },
      {
        title: 'Penthouse Architectural Planning',
        description:
          'End-to-end architectural planning for landmark penthouses and headquarters that command their skyline.',
        image:
          'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
      },
      {
        title: 'Minimalist Spatial Restoration',
        description:
          'Restoring and reimagining heritage commercial spaces with a disciplined, minimalist hand.',
        image:
          'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800',
      },
      {
        title: 'High-End Textile & Material Sourcing',
        description:
          'A global material library that elevates every surface, from boardroom to lobby.',
        image:
          'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
      },
    ],
  },
  {
    key: 'furniture',
    label: 'Bespoke Furniture',
    items: [
      {
        title: 'Made-to-Measure Collections',
        description:
          'Furniture designed and built to the millimetre for your space, by master cabinetmakers.',
        image:
          'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800',
      },
      {
        title: 'Sculptural Statement Pieces',
        description:
          'One-of-a-kind centrepieces that anchor a room and start a conversation.',
        image:
          'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800',
      },
      {
        title: 'Artisan Upholstery',
        description:
          'Hand-finished upholstery in the world’s finest leathers and performance fabrics.',
        image:
          'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800',
      },
    ],
  },
  {
    key: 'lighting',
    label: 'Lighting Curation',
    items: [
      {
        title: 'Architectural Lighting Design',
        description:
          'Layered lighting schemes that sculpt space and shift gracefully from day to night.',
        image:
          'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
      },
      {
        title: 'Statement Fixtures',
        description:
          'Curated and commissioned fixtures that become the jewellery of the room.',
        image:
          'https://images.unsplash.com/photo-1543248939-4296e1fea89b?w=800',
      },
      {
        title: 'Smart Lighting Integration',
        description:
          'Seamless automation and circadian scenes controlled from a single touch.',
        image:
          'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800',
      },
    ],
  },
  {
    key: 'decor',
    label: 'Art & Decor',
    items: [
      {
        title: 'Gallery-Grade Curation',
        description:
          'Museum-quality art advisory and placement tailored to each residence.',
        image:
          'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=800',
      },
      {
        title: 'Objet & Accessory Styling',
        description:
          'The finishing layer — books, ceramics, and objet that make a house feel lived-in and refined.',
        image:
          'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800',
      },
      {
        title: 'Seasonal Refresh Programs',
        description:
          'Ongoing styling programs that keep interiors current and effortless year-round.',
        image:
          'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=800',
      },
    ],
  },
]

export default function ServicesShowcase() {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(0)
  const category = categories[active]

  const selectCategory = (i: number) => {
    setActive(i)
    setOpen(0)
  }

  return (
    <section className="bg-cream py-24 md:py-32">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="container-content grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr]"
      >
        {/* Left — heading + category tabs */}
        <div className="flex flex-col">
          <motion.h2 variants={fadeInUp} className="text-h2 text-balance">
            Curate, Design &amp; Elevate with PlanetVision
          </motion.h2>

          <motion.ul variants={fadeInUp} className="mt-10 space-y-3">
            {categories.map((c, i) => (
              <li key={c.key}>
                <button
                  onClick={() => selectCategory(i)}
                  className={cn(
                    'text-lg transition-colors duration-300',
                    i === active
                      ? 'font-medium text-heading'
                      : 'text-muted hover:text-heading'
                  )}
                >
                  {c.label}
                </button>
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fadeInUp} className="mt-auto pt-10">
            <Link href="/properties" className="btn-primary">
              See All Projects <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Right — numbered accordion */}
        <motion.div variants={fadeInUp} className="divide-y divide-line border-y border-line">
          {category.items.map((item, i) => {
            const isOpen = i === open
            return (
              <div key={item.title}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center gap-4 py-5 text-left"
                >
                  <span className="text-xs tabular-nums text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={cn(
                      'font-playfair text-xl transition-colors md:text-2xl',
                      isOpen ? 'text-heading' : 'text-heading/80'
                    )}
                  >
                    {item.title}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pl-9">
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-card">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                          />
                        </div>
                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-body">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </motion.div>
      </motion.div>
    </section>
  )
}
