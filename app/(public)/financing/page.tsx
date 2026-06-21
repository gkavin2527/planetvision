import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Percent, Clock3, ArrowRight } from 'lucide-react'
import MortgageCalculator from '@/components/tools/MortgageCalculator'
import InquiryForm from '@/components/properties/InquiryForm'

export const metadata: Metadata = {
  title: 'Financing & Pre-Qualification',
  description:
    'Estimate your payment and get pre-qualified with a PlanetVision lending partner.',
}

const perks = [
  {
    icon: Percent,
    title: 'Competitive rates',
    body: 'Access to jumbo and conventional programmes tailored to luxury purchases.',
  },
  {
    icon: Clock3,
    title: 'Fast pre-approval',
    body: 'A pre-qualification letter in as little as 24 hours to strengthen your offer.',
  },
  {
    icon: ShieldCheck,
    title: 'Guided every step',
    body: 'A dedicated loan advisor from application through to closing.',
  },
]

export default function FinancingPage() {
  return (
    <>
      <section className="bg-bark pb-16 pt-32">
        <div className="container-content">
          <span className="eyebrow !text-sand">Home Loans</span>
          <h1 className="mt-3 font-playfair text-hero !text-white">Financing</h1>
          <p className="mt-4 max-w-xl text-lg font-light text-white/70">
            Know your numbers and get pre-qualified before you make an offer.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="#prequal" className="btn-primary-light">
              Get pre-qualified <ArrowRight size={16} />
            </Link>
            <Link href="/calculators" className="btn-ghost-light">
              Affordability calculator
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container-content">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {perks.map((p) => {
              const Icon = p.icon
              return (
                <div key={p.title} className="rounded-card bg-surface p-6 shadow-card">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-dark">
                    <Icon size={20} className="text-sand" />
                  </div>
                  <h3 className="mt-4 font-playfair text-xl text-heading">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{p.body}</p>
                </div>
              )
            })}
          </div>

          {/* Payment estimator */}
          <div className="mt-16">
            <span className="eyebrow">Estimate your payment</span>
            <h2 className="mt-2 font-playfair text-h2 text-heading">
              Monthly payment calculator
            </h2>
            <div className="mt-6">
              <MortgageCalculator />
            </div>
          </div>

          {/* Pre-qual form */}
          <div
            id="prequal"
            className="mt-16 grid grid-cols-1 gap-10 rounded-card bg-cream-dark p-8 lg:grid-cols-2 lg:p-12"
          >
            <div>
              <span className="eyebrow">Soft check, no impact to credit</span>
              <h2 className="mt-3 font-playfair text-h2 text-heading">
                Get pre-qualified
              </h2>
              <p className="mt-4 text-body">
                Share a few details and a lending partner will reach out with your
                options. It only takes a couple of minutes.
              </p>
            </div>
            <InquiryForm defaultMessage="I'd like to get pre-qualified. My budget / situation: " />
          </div>
        </div>
      </section>
    </>
  )
}
