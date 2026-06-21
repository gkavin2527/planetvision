'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/animations'
import { cn } from '@/lib/utils'

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  light = false,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  light?: boolean
  className?: string
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        'max-w-2xl',
        align === 'center' && 'mx-auto',
        className
      )}
    >
      {eyebrow && (
        <motion.span
          variants={fadeInUp}
          className={cn('eyebrow', light && 'text-sand')}
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        variants={fadeInUp}
        className={cn('text-h2 text-balance', light && '!text-white')}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeInUp}
          className={cn(
            'text-lg font-light leading-relaxed',
            light ? 'text-white/70' : 'text-body'
          )}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  )
}
