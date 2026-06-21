'use client'

import { useState } from 'react'
import Accordion from '@/components/ui/Accordion'
import { cn } from '@/lib/utils'

const categories = {
  General: [
    {
      q: 'What is PlanetVision?',
      a: 'PlanetVision is a premium real estate firm specializing in luxury properties for sale and rent across the world’s most desirable locations.',
    },
    {
      q: 'How are your properties selected?',
      a: 'Every listing is hand-selected by our advisors based on craftsmanship, location, design integrity, and long-term value.',
    },
    {
      q: 'Do you offer virtual tours?',
      a: 'Yes. Most of our listings include high-resolution galleries, and we can arrange live virtual walkthroughs on request.',
    },
    {
      q: 'How do I contact an advisor?',
      a: 'You can reach us through the contact page, submit an inquiry on any listing, or call our office directly during business hours.',
    },
    {
      q: 'Where are you located?',
      a: 'Our headquarters are in Miami, with advisors covering New York, Los Angeles, Chicago, and Houston.',
    },
  ],
  Buying: [
    {
      q: 'What is the buying process like?',
      a: 'After an initial consultation, we curate a shortlist, arrange viewings, negotiate on your behalf, and guide you through closing — start to finish.',
    },
    {
      q: 'Can you help with financing?',
      a: 'We partner with trusted private banks and mortgage brokers and can introduce you to the right financing partner for your situation.',
    },
    {
      q: 'Do you work with international buyers?',
      a: 'Absolutely. We regularly support international clients with remote viewings, legal coordination, and relocation guidance.',
    },
    {
      q: 'How long does a typical purchase take?',
      a: 'Timelines vary, but most luxury transactions close within 30 to 60 days of an accepted offer.',
    },
    {
      q: 'Are there additional purchase costs?',
      a: 'Beyond the purchase price, expect closing costs, taxes, and any applicable HOA or building fees. Your advisor will outline these clearly upfront.',
    },
  ],
  Renting: [
    {
      q: 'Do you offer luxury rentals?',
      a: 'Yes. Our portfolio includes premium long- and short-term rentals. Filter any listing page by “For Rent” to browse.',
    },
    {
      q: 'What documents do I need to rent?',
      a: 'Typically proof of identity, proof of income or funds, and references. Requirements vary by building and will be shared in advance.',
    },
    {
      q: 'Are rentals furnished?',
      a: 'Many of our luxury rentals are available fully furnished. Each listing specifies its furnishing status.',
    },
    {
      q: 'What is the minimum lease term?',
      a: 'Most properties require a minimum lease of six to twelve months, though select short-term options are available.',
    },
    {
      q: 'Is a security deposit required?',
      a: 'Yes, a security deposit is standard — usually equivalent to one or two months’ rent depending on the property.',
    },
  ],
  Pricing: [
    {
      q: 'How is property pricing determined?',
      a: 'Pricing reflects comparable sales, location, condition, amenities, and current market dynamics, validated by our market analysts.',
    },
    {
      q: 'Is the listed price negotiable?',
      a: 'In many cases, yes. Our advisors negotiate skillfully on your behalf to reach the best possible terms.',
    },
    {
      q: 'Do you charge buyers a fee?',
      a: 'In most markets, our advisory fee is covered by the seller. Where buyer-side fees apply, they are disclosed transparently upfront.',
    },
    {
      q: 'How often are prices updated?',
      a: 'Listings are reviewed regularly to ensure pricing remains aligned with the current market.',
    },
    {
      q: 'Can I get a valuation for my own property?',
      a: 'Yes. We offer complimentary, no-obligation valuations — simply contact our team to arrange one.',
    },
  ],
}

type Category = keyof typeof categories

export default function FaqPage() {
  const [active, setActive] = useState<Category>('General')
  const tabs = Object.keys(categories) as Category[]

  return (
    <>
      <section className="bg-bark pt-32 pb-16">
        <div className="container-content">
          <span className="eyebrow !text-sand">Help Center</span>
          <h1 className="mt-3 font-playfair text-hero !text-white">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 max-w-xl text-lg font-light text-white/70">
            Everything you need to know about buying, renting, and working with
            PlanetVision.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container-content max-w-3xl">
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={cn(
                  'rounded-full px-5 py-2 text-sm transition-colors',
                  active === tab
                    ? 'bg-bark text-white'
                    : 'border border-sand text-body hover:border-bark'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <Accordion key={active} items={categories[active]} />
        </div>
      </section>
    </>
  )
}
