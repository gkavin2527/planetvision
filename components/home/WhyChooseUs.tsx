'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Star, HeartHandshake, MapPin } from 'lucide-react'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/animations'
import Button from '@/components/ui/Button'

const features = [
  {
    icon: ShieldCheck,
    title: 'Expert Guidance',
    desc: 'Seasoned advisors who navigate every detail of your purchase.',
  },
  {
    icon: Star,
    title: 'Curated Listings',
    desc: 'Only the finest properties make it into our portfolio.',
  },
  {
    icon: HeartHandshake,
    title: 'Personal Service',
    desc: 'A dedicated specialist tailored to your unique needs.',
  },
  {
    icon: MapPin,
    title: 'Prime Locations',
    desc: 'Homes in the world’s most sought-after neighborhoods.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="bg-cream-dark py-24 md:py-32">
      <div className="container-content grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] overflow-hidden rounded-card"
        >
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200"
            alt="Elegant interior"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.span variants={fadeInUp} className="eyebrow">
            Why Choose PlanetVision
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="mt-4 text-h2 text-balance"
          >
            Timeless Interiors, Elevated Living
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-5 text-lg font-light leading-relaxed text-body"
          >
            We blend architectural artistry with uncompromising service to help
            you find a home that reflects how you want to live — refined,
            considered, and entirely your own.
          </motion.p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeInUp} className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand/20 text-sand">
                  <f.icon size={20} />
                </div>
                <div>
                  <h3 className="font-playfair text-lg text-heading">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-body">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-10">
            <Button href="/about" variant="ghost">
              More About Us <ArrowRight size={16} />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
