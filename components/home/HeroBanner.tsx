'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import ThemeToggle from '@/components/theme/ThemeToggle'

const DUSK = '/hero-dusk.jpg'
const DAWN = '/hero-dawn.jpg'
const WORDMARK = 'PLANETVISION'

/** Dawn image in light mode, dusk image in dark mode (pure-CSS crossfade). */
function HeroImages({ priority = false }: { priority?: boolean }) {
  return (
    <>
      <Image
        src={DAWN}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover opacity-100 transition-opacity duration-700 dark:opacity-0"
      />
      <Image
        src={DUSK}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover opacity-0 transition-opacity duration-700 dark:opacity-100"
      />
    </>
  )
}

export default function HeroBanner() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, 200])

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-bark">
      {/* Background image with parallax */}
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[6%] h-[118%]">
        <HeroImages priority />
      </motion.div>

      {/* Legibility tint — minimal at day, deeper at night */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 dark:from-black/25 dark:via-black/5 dark:to-black/60" />

      {/* Brand lockup — giant wordmark with its descriptor line beneath it */}
      <div className="absolute inset-x-0 top-[13%] z-10 flex flex-col items-center px-4">
        <h1
          aria-label={WORDMARK}
          className="hero-wordmark select-none whitespace-nowrap text-center text-bark dark:text-white"
        >
          {WORDMARK.split('').map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden
              initial={{ y: '60%', opacity: 0, filter: 'blur(6px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.25 + i * 0.055,
              }}
              className="inline-block"
            >
              {ch}
            </motion.span>
          ))}
        </h1>

        {/* Descriptor — luxury logotype subtitle (think BVLGARI · Fine Jewellery) */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="mt-3 text-center font-light uppercase tracking-[0.08em] text-[clamp(0.85rem,1.5vw,1rem)] text-bark [text-shadow:0_1px_14px_rgba(255,255,255,0.6)] dark:text-white dark:[text-shadow:0_2px_18px_rgba(0,0,0,0.8)] md:mt-5"
        >
          Exceptional Properties. Elevated Living.
        </motion.p>
      </div>

      {/* Bottom-right theme toggle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute bottom-10 right-6 z-30 md:right-8"
      >
        <ThemeToggle variant="glass" />
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[0.625rem] uppercase tracking-[0.25em] text-bark/70 dark:text-white/60">
          Scroll
        </span>
        <div className="h-9 w-px overflow-hidden bg-bark/20 dark:bg-white/20">
          <motion.div
            animate={{ y: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="h-1/2 w-px bg-bark dark:bg-white"
          />
        </div>
      </motion.div>
    </section>
  )
}
