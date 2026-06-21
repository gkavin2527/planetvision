'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/animations'
import Button from '@/components/ui/Button'

export default function CallToAction() {
  return (
    <section className="bg-bark py-24 md:py-32">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="container-content flex flex-col items-center text-center"
      >
        <motion.span variants={fadeInUp} className="eyebrow !text-sand">
          Begin Your Journey
        </motion.span>
        <motion.h2
          variants={fadeInUp}
          className="mt-4 max-w-3xl text-h2 text-balance !text-white"
        >
          Ready to Find Your Dream Property?
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mt-5 max-w-xl text-lg font-light text-white/70"
        >
          Let our specialists guide you to a home that matches your vision.
          Browse listings or speak with our team today.
        </motion.p>
        <motion.div variants={fadeInUp} className="mt-9 flex flex-wrap justify-center gap-4">
          <Button href="/properties" variant="primary-light">
            Browse Properties <ArrowRight size={16} />
          </Button>
          <Button href="/contact" variant="ghost-light">
            Contact Our Team
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
