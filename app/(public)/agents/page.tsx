import type { Metadata } from 'next'
import Image from 'next/image'
import { Star, Phone, Mail, Award } from 'lucide-react'
import InquiryForm from '@/components/properties/InquiryForm'

export const metadata: Metadata = {
  title: 'Find an Agent',
  description:
    'Connect with a PlanetVision advisor specialising in luxury homes.',
}

const agents = [
  {
    name: 'Jonathan Hale',
    title: 'Senior Property Advisor',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    rating: 4.9,
    deals: 182,
    areas: ['Miami', 'Coral Gables'],
    specialty: 'Waterfront estates',
  },
  {
    name: 'Amara Whitfield',
    title: 'Luxury Specialist',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    rating: 5.0,
    deals: 146,
    areas: ['Beverly Hills', 'Malibu'],
    specialty: 'Architectural homes',
  },
  {
    name: 'Diego Marsh',
    title: 'Investment Advisor',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    rating: 4.8,
    deals: 210,
    areas: ['New York', 'Hamptons'],
    specialty: 'Penthouses & condos',
  },
  {
    name: 'Sofia Bennett',
    title: 'New Developments Lead',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    rating: 4.9,
    deals: 134,
    areas: ['Austin', 'Dallas'],
    specialty: 'Modern builds',
  },
  {
    name: 'Marcus Lee',
    title: 'Relocation Expert',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    rating: 4.7,
    deals: 98,
    areas: ['Seattle', 'Portland'],
    specialty: 'Family residences',
  },
  {
    name: 'Priya Nair',
    title: 'Senior Property Advisor',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    rating: 5.0,
    deals: 175,
    areas: ['San Francisco', 'Palo Alto'],
    specialty: 'Hillside & view homes',
  },
]

export default function AgentsPage() {
  return (
    <>
      <section className="bg-bark pb-16 pt-32">
        <div className="container-content">
          <span className="eyebrow !text-sand">Our Advisors</span>
          <h1 className="mt-3 font-playfair text-hero !text-white">Find an Agent</h1>
          <p className="mt-4 max-w-xl text-lg font-light text-white/70">
            Work with a specialist who knows your market inside out.
          </p>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container-content">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((a) => (
              <div
                key={a.name}
                className="rounded-card bg-surface p-6 shadow-card transition-all duration-500 ease-luxe hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={a.photo}
                    alt={a.name}
                    width={72}
                    height={72}
                    className="h-18 w-18 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-playfair text-xl text-heading">{a.name}</p>
                    <p className="text-xs uppercase tracking-[0.1em] text-muted">
                      {a.title}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-body">
                      <Star size={14} className="fill-sand text-sand" />
                      {a.rating.toFixed(1)}
                      <span className="text-muted">· {a.deals} deals</span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm text-body">
                  <Award size={15} className="text-sand" />
                  {a.specialty}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {a.areas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full bg-cream-dark px-3 py-1 text-xs text-body"
                    >
                      {area}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex gap-3 border-t border-cream-dark pt-5">
                  <a
                    href="tel:+13055550142"
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-heading py-2.5 text-sm text-heading transition-colors hover:bg-heading hover:text-cream"
                  >
                    <Phone size={15} /> Call
                  </a>
                  <a
                    href="mailto:advisor@planetvision.com"
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-bark py-2.5 text-sm text-white transition-colors hover:bg-bark-mid dark:bg-sand dark:text-bark"
                  >
                    <Mail size={15} /> Email
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Match-me form */}
          <div className="mt-20 grid grid-cols-1 gap-10 rounded-card bg-cream-dark p-8 lg:grid-cols-2 lg:p-12">
            <div>
              <span className="eyebrow">Not sure who to pick?</span>
              <h2 className="mt-3 font-playfair text-h2 text-heading">
                Get matched with an advisor
              </h2>
              <p className="mt-4 text-body">
                Tell us what you&apos;re looking for and we&apos;ll connect you with
                the specialist best suited to your search — at no cost.
              </p>
            </div>
            <InquiryForm defaultMessage="I'd like to be matched with an advisor. I'm looking for…" />
          </div>
        </div>
      </section>
    </>
  )
}
