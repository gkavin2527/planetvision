import type { Metadata } from 'next'
import Link from 'next/link'
import { ClipboardList, Camera, Megaphone, HandCoins, ArrowRight } from 'lucide-react'
import InquiryForm from '@/components/properties/InquiryForm'

export const metadata: Metadata = {
  title: 'List Your Home',
  description:
    'Sell your home with PlanetVision — expert pricing, marketing and negotiation.',
}

const steps = [
  {
    icon: ClipboardList,
    title: 'Tell us about it',
    body: 'Share the basics — location, size and condition. We respond within a day.',
  },
  {
    icon: Camera,
    title: 'We prepare & shoot',
    body: 'Professional photography, staging guidance and a pricing strategy from comps.',
  },
  {
    icon: Megaphone,
    title: 'Maximum exposure',
    body: 'Your home is marketed to our private buyer network and across our platform.',
  },
  {
    icon: HandCoins,
    title: 'Negotiate & close',
    body: 'We handle offers, negotiation and paperwork through to closing day.',
  },
]

export default function SellPage() {
  return (
    <>
      <section className="bg-bark pb-16 pt-32">
        <div className="container-content">
          <span className="eyebrow !text-sand">Sell With Us</span>
          <h1 className="mt-3 font-playfair text-hero !text-white">
            List Your Home
          </h1>
          <p className="mt-4 max-w-xl text-lg font-light text-white/70">
            Premium marketing and seasoned negotiation to get you the best price,
            faster.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="#list-form" className="btn-primary-light">
              Request a free valuation <ArrowRight size={16} />
            </Link>
            <Link href="/calculators" className="btn-ghost-light">
              Estimate net proceeds
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 md:py-32">
        <div className="container-content">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={s.title} className="rounded-card bg-surface p-6 shadow-card">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-dark">
                    <Icon size={20} className="text-sand" />
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1 font-playfair text-xl text-heading">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{s.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Lead form */}
      <section id="list-form" className="pb-20">
        <div className="container-content grid grid-cols-1 gap-10 rounded-card bg-cream-dark p-8 lg:grid-cols-2 lg:p-12">
          <div>
            <span className="eyebrow">Free, no obligation</span>
            <h2 className="mt-3 font-playfair text-h2 text-heading">
              What&apos;s your home worth?
            </h2>
            <p className="mt-4 text-body">
              Send us your property details and a PlanetVision advisor will prepare
              a complimentary valuation and listing plan.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-body">
              <li>· Comparable-based pricing analysis</li>
              <li>· Tailored marketing proposal</li>
              <li>· Projected timeline to sale</li>
            </ul>
          </div>
          <InquiryForm defaultMessage="I'd like to list my home. Address / details: " />
        </div>
      </section>
    </>
  )
}
