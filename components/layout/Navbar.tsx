'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, CalendarDays, Heart, ChevronDown } from 'lucide-react'
import ThemeToggle from '@/components/theme/ThemeToggle'
import { useFavorites } from '@/lib/property-store'
import { cn } from '@/lib/utils'

// Shown directly in the desktop pill.
const primaryLinks = [
  { href: '/properties', label: 'Browse Properties' },
  { href: '/about', label: 'Our Story' },
  { href: '/contact', label: 'Contact' },
]

// Everything else, grouped under the "More" dropdown on desktop. Together with
// the primary links + brand this covers every public page in the site.
const moreGroups = [
  {
    label: 'Discover',
    links: [
      { href: '/properties?view=map', label: 'Map Search' },
      { href: '/saved', label: 'Saved Homes' },
      { href: '/compare', label: 'Compare Homes' },
    ],
  },
  {
    label: 'Buy, Sell & Finance',
    links: [
      { href: '/agents', label: 'Find an Agent' },
      { href: '/calculators', label: 'Calculators' },
      { href: '/financing', label: 'Financing' },
      { href: '/sell', label: 'List Your Home' },
    ],
  },
  {
    label: 'Company',
    links: [
      { href: '/blog', label: 'Blog' },
      { href: '/faq', label: 'FAQ' },
    ],
  },
]

// Flat list (primary + every grouped link) for the mobile menu.
const allMobileLinks = [
  ...primaryLinks,
  ...moreGroups.flatMap((g) => g.links),
]

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLLIElement>(null)
  const { count: savedCount } = useFavorites()

  // Plain scroll listener — used to reveal the brand and flip text colour
  // once the navbar has moved off the dark hero band.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the "More" menu on outside click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // Close menus whenever the route changes.
  useEffect(() => {
    setMoreOpen(false)
    setOpen(false)
  }, [pathname])

  // Inner pages open with a dark `bg-bark` hero. While the navbar sits over it
  // (top of an inner page), bare text/icons go white in BOTH themes. Elsewhere
  // they use the theme-aware heading colour. The pill chips carry their own
  // translucent background, so they stay legible over any backdrop.
  const overDarkHero = !isHome && !scrolled

  // Brand appears once the giant hero wordmark is out of view (or on inner pages).
  const showBrand = scrolled || !isHome

  const navText = overDarkHero ? 'text-white' : 'text-heading'

  const glass = overDarkHero
    ? 'border border-white/25 bg-white/10 backdrop-blur-md'
    : 'border border-black/10 bg-white/70 backdrop-blur-md dark:border-white/20 dark:bg-white/10'

  const linkHover = overDarkHero
    ? 'hover:bg-white/10 hover:text-white'
    : 'hover:bg-black/5 hover:text-bark dark:hover:bg-white/10 dark:hover:text-white'

  const linkClass = cn(
    'rounded-full px-5 py-2.5 text-[15px] font-medium transition-colors duration-200',
    navText,
    linkHover
  )

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent transition-all duration-500">
      <nav className="container-content flex h-20 items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className={cn(
            'nav-legible font-inter text-xl font-bold tracking-tight transition-all duration-200',
            navText,
            showBrand ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
        >
          PLANETVISION
        </Link>

        {/* Center link pill */}
        <ul
          className={cn(
            'absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full px-3 py-2 lg:flex',
            glass
          )}
        >
          {primaryLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={linkClass}>
                {link.label}
              </Link>
            </li>
          ))}

          {/* More dropdown */}
          <li ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              className={cn(linkClass, 'flex items-center gap-1')}
            >
              More
              <ChevronDown
                size={15}
                className={cn('transition-transform duration-200', moreOpen && 'rotate-180')}
              />
            </button>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 top-full mt-3 w-60 overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-card"
                >
                  {moreGroups.map((group) => (
                    <div key={group.label} className="py-1">
                      <p className="px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                        {group.label}
                      </p>
                      <ul>
                        {group.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={() => setMoreOpen(false)}
                              className="block rounded-lg px-4 py-2 text-sm text-heading transition-colors duration-200 hover:bg-cream-dark"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {!isHome && (
            <ThemeToggle variant="glass" className="hidden lg:flex" />
          )}
          <Link
            href="/saved"
            aria-label="Saved homes"
            className={cn(
              'relative hidden h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 lg:flex',
              navText,
              overDarkHero ? 'hover:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/10'
            )}
          >
            <Heart size={18} />
            {savedCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-sand px-1 text-[10px] font-semibold text-bark">
                {savedCount}
              </span>
            )}
          </Link>
          <Link
            href="/contact"
            className={cn(
              'hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors duration-200 lg:flex',
              glass,
              navText,
              overDarkHero
                ? 'hover:bg-white hover:text-bark'
                : 'hover:bg-heading hover:text-cream'
            )}
          >
            Book a Viewing
            <CalendarDays size={15} />
          </Link>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className={cn('transition-colors duration-200 lg:hidden', navText)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line nav-drawer backdrop-blur-md lg:hidden"
          >
            <ul className="container-content flex flex-col gap-1 py-4">
              {allMobileLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-base font-light text-heading transition-colors duration-200 hover:text-sand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="flex items-center justify-between pt-2">
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="btn-ghost"
                >
                  Book a Viewing <ArrowRight size={16} />
                </Link>
                <ThemeToggle variant="auto" />
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
