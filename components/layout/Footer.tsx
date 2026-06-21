import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Twitter, ArrowRight, MapPin, Phone, Mail } from 'lucide-react'
import FooterBrand from '@/components/layout/FooterBrand'

const discoverLinks = [
  { href: '/properties', label: 'All Properties' },
  { href: '/properties?view=map', label: 'Map Search' },
  { href: '/saved', label: 'Saved Homes' },
  { href: '/compare', label: 'Compare Homes' },
  { href: '/agents', label: 'Find an Agent' },
]

const buySellLinks = [
  { href: '/calculators', label: 'Mortgage Calculator' },
  { href: '/calculators', label: 'Affordability' },
  { href: '/financing', label: 'Get Pre-Qualified' },
  { href: '/sell', label: 'List Your Home' },
]

const companyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
]

const avatars = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80',
]

export default function Footer() {
  return (
    <footer className="bg-bark-mid text-white/80">
      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="container-content flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <div className="flex -space-x-3">
              {avatars.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-11 w-11 rounded-full border-2 border-bark-mid object-cover"
                />
              ))}
            </div>
            <p className="font-playfair text-2xl text-white md:text-3xl">
              Discover Timeless Properties
            </p>
          </div>
          <Link href="/properties" className="btn-primary-light">
            Start Your Search <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Columns */}
      <div className="container-content grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <h3 className="font-inter text-xl font-bold tracking-tight text-white">
            PLANETVISION
          </h3>
          <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-white/60">
            A vision that transcends property and space, where unmatched
            craftsmanship inspires elegance and innovation to enrich lives.
          </p>
          <div className="mt-6 flex gap-3">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social link"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-sand hover:text-sand"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow !text-sand">Discover</p>
          <ul className="mt-5 space-y-3 text-sm font-light">
            {discoverLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="opacity-60 transition-opacity duration-200 hover:opacity-100">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow !text-sand">Buy &amp; Sell</p>
          <ul className="mt-5 space-y-3 text-sm font-light">
            {buySellLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="opacity-60 transition-opacity duration-200 hover:opacity-100">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow !text-sand">Company</p>
          <ul className="mt-5 space-y-3 text-sm font-light">
            {companyLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="opacity-60 transition-opacity duration-200 hover:opacity-100">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow !text-sand">Get In Touch</p>
          <ul className="mt-5 space-y-4 text-sm font-light">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-sand" />
              200 Biscayne Blvd, Miami, FL 33131
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="shrink-0 text-sand" />
              +1 (305) 555-0142
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="shrink-0 text-sand" />
              hello@planetvision.com
            </li>
          </ul>
        </div>
      </div>

      {/* Giant brand with image-clipped letters (scroll parallax) */}
      <FooterBrand text="PLANETVISION" />

      <div className="border-t border-white/10">
        <div className="container-content flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>©2026 PlanetVision. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
