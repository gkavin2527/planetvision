import type { Metadata } from 'next'
import Image from 'next/image'
import { Target, Gem, Users } from 'lucide-react'
import StatsStrip from '@/components/home/StatsStrip'
import SectionHeading from '@/components/ui/SectionHeading'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'PlanetVision is a premium real estate firm dedicated to designing spaces that define luxury.',
}

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    desc: 'To connect discerning clients with extraordinary homes through honest counsel and uncompromising service.',
  },
  {
    icon: Gem,
    title: 'Our Standard',
    desc: 'Every listing is hand-selected for its craftsmanship, location, and enduring value.',
  },
  {
    icon: Users,
    title: 'Our People',
    desc: 'A close-knit team of advisors who treat every client relationship as a lasting partnership.',
  },
]

const team = [
  {
    name: 'Jonathan Hale',
    role: 'Founder & Principal',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  },
  {
    name: 'Sophia Bennett',
    role: 'Head of Sales',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  },
  {
    name: 'Marcus Reed',
    role: 'Lead Architect Advisor',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  },
  {
    name: 'Elena Foster',
    role: 'Client Relations',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[60vh] items-center">
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600"
          alt="PlanetVision"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-bark/55" />
        <div className="container-content relative">
          <span className="eyebrow !text-sand">Our Story</span>
          <h1 className="mt-3 font-playfair text-hero !text-white">
            About PlanetVision
          </h1>
        </div>
      </section>

      {/* Story block 1 */}
      <section className="py-24">
        <div className="container-content grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-card">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000"
              alt="Interior"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Established 2015"
              title="A Decade of Defining Luxury Living"
              description="What began as a boutique advisory has grown into one of the most trusted names in luxury real estate. Our philosophy has never changed: every home tells a story, and every client deserves a space that tells theirs."
            />
            <p className="mt-5 text-base font-light leading-relaxed text-body">
              We pair deep market intelligence with a genuine love of design,
              guiding our clients through some of the most important decisions of
              their lives with clarity and care.
            </p>
          </div>
        </div>
      </section>

      {/* Story block 2 (reversed) */}
      <section className="bg-cream-dark py-24">
        <div className="container-content grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <SectionHeading
              eyebrow="Our Approach"
              title="Considered, Personal, Uncompromising"
              description="We don't believe in volume — we believe in fit. Each property in our portfolio is chosen because it represents the very best of its kind."
            />
            <div className="mt-8">
              <Button href="/properties" variant="ghost">
                Explore Our Portfolio
              </Button>
            </div>
          </div>
          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-card lg:order-2">
            <Image
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000"
              alt="Interior"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="container-content">
          <SectionHeading
            eyebrow="What We Stand For"
            title="Mission & Values"
            align="center"
          />
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-card bg-surface p-8 text-center shadow-card"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sand/20 text-sand">
                  <v.icon size={24} />
                </div>
                <h3 className="mt-5 font-playfair text-xl text-heading">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-body">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatsStrip />

      {/* Team */}
      <section className="py-24">
        <div className="container-content">
          <SectionHeading
            eyebrow="The People"
            title="Meet Our Team"
            align="center"
          />
          <div className="mt-14 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {team.map((m) => (
              <div key={m.name} className="group text-center">
                <div className="relative aspect-[3/4] overflow-hidden rounded-card">
                  <Image
                    src={m.img}
                    alt={m.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 font-playfair text-lg text-heading">{m.name}</h3>
                <p className="text-xs uppercase tracking-[0.1em] text-muted">
                  {m.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
