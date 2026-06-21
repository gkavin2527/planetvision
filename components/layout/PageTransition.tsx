'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

/**
 * Blur-in transition that replays on every route change — mirrors the
 * soft blur transition in the reference video.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, filter: 'blur(14px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
