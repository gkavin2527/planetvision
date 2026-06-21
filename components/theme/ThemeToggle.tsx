'use client'

import { Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/components/theme/ThemeProvider'
import { cn } from '@/lib/utils'

const variantClass: Record<string, string> = {
  // Theme-aware page control
  auto: 'border-line text-heading hover:bg-cream-dark',
  // Forced light-on-dark (always white)
  light: 'border-white/40 text-white hover:bg-white/10',
  // Translucent control that adapts over either hero image
  glass:
    'border-black/15 bg-white/40 text-bark backdrop-blur-md hover:bg-white/60 dark:border-white/30 dark:bg-black/25 dark:text-white dark:hover:bg-black/40',
}

export default function ThemeToggle({
  className,
  variant = 'auto',
}: {
  className?: string
  variant?: 'auto' | 'light' | 'glass'
}) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300',
        variantClass[variant],
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.25 }}
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
