'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/animations'
import SectionHeading from '@/components/ui/SectionHeading'

const testimonials = [
  {
    quote:
      'PlanetVision made finding our dream villa effortless. Their attention to detail and market knowledge is simply unmatched.',
    name: 'Sophia Bennett',
    role: 'Villa Owner, Miami',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
  },
  {
    quote:
      'From the first viewing to closing, the team was professional, responsive, and genuinely invested in our happiness.',
    name: 'Marcus Reed',
    role: 'Penthouse Buyer, New York',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
  },
  {
    quote:
      'A truly bespoke experience. They understood exactly what we wanted and delivered beyond our expectations.',
    name: 'Elena Foster',
    role: 'Investor, Los Angeles',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120',
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-content">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by Discerning Clients"
          description="The relationships we build are as enduring as the homes we sell."
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 no-scrollbar md:grid md:grid-cols-3 md:overflow-visible"
        >
          {testimonials.map((t) => (
            <motion.figure
              key={t.name}
              variants={fadeInUp}
              className="min-w-[85%] snap-center rounded-card bg-surface p-8 shadow-card sm:min-w-[70%] md:min-w-0"
            >
              <Quote size={32} className="text-sand" />
              <div className="mt-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="fill-sand text-sand" />
                ))}
              </div>
              <blockquote className="mt-4 text-lg font-light leading-relaxed text-body">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-4">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-playfair text-base text-heading">{t.name}</p>
                  <p className="text-xs uppercase tracking-[0.1em] text-muted">
                    {t.role}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
