import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights, market trends, and inspiration from the world of luxury real estate.',
}

const blogPosts = [
  {
    id: 1,
    title: 'Top Luxury Real Estate Trends 2025',
    category: 'Market Insights',
    date: 'Jan 15, 2025',
    excerpt:
      'Explore how the luxury market is evolving — from wellness architecture to smart-home integration and the rise of branded residences.',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
  },
  {
    id: 2,
    title: 'Designing Interiors That Stand the Test of Time',
    category: 'Design',
    date: 'Jan 8, 2025',
    excerpt:
      'Timeless interiors balance restraint with character. Here is how the best designers create spaces that never feel dated.',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  },
  {
    id: 3,
    title: 'A Buyer’s Guide to Penthouse Living',
    category: 'Buying Guide',
    date: 'Dec 22, 2024',
    excerpt:
      'From sightlines to service charges, everything you should know before purchasing at the top of the tower.',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  },
  {
    id: 4,
    title: 'Why Location Still Reigns Supreme',
    category: 'Investment',
    date: 'Dec 10, 2024',
    excerpt:
      'The oldest rule in real estate remains the most reliable. We break down what makes a location truly premium.',
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
  },
  {
    id: 5,
    title: 'The Quiet Luxury of Coastal Villas',
    category: 'Lifestyle',
    date: 'Nov 28, 2024',
    excerpt:
      'Understated elegance by the water — a look at why coastal villas continue to captivate discerning buyers.',
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
  },
  {
    id: 6,
    title: 'Staging Secrets from the Pros',
    category: 'Selling Tips',
    date: 'Nov 14, 2024',
    excerpt:
      'Small touches, big returns. Professional stagers share the details that help luxury homes sell faster.',
    image:
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
  },
]

export default function BlogPage() {
  const [featured, ...rest] = blogPosts

  return (
    <>
      <section className="bg-bark pt-32 pb-16">
        <div className="container-content">
          <span className="eyebrow !text-sand">Journal</span>
          <h1 className="mt-3 font-playfair text-hero !text-white">
            The PlanetVision Blog
          </h1>
          <p className="mt-4 max-w-xl text-lg font-light text-white/70">
            Insights, market trends, and inspiration from the world of luxury
            living.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container-content">
          {/* Featured */}
          <article className="group grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-card">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.1em] text-muted">
                <span className="rounded-full bg-sand/20 px-3 py-1 text-sand">
                  {featured.category}
                </span>
                <span>{featured.date}</span>
              </div>
              <h2 className="mt-4 font-playfair text-h2 text-heading">
                {featured.title}
              </h2>
              <p className="mt-4 text-lg font-light leading-relaxed text-body">
                {featured.excerpt}
              </p>
              <a
                href="#"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-heading transition-colors hover:text-sand"
              >
                Read More <ArrowRight size={16} />
              </a>
            </div>
          </article>

          {/* Grid */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <article
                key={post.id}
                className="group overflow-hidden rounded-card bg-surface shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.1em] text-muted">
                    <span className="text-sand">{post.category}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="mt-3 font-playfair text-xl text-heading">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">
                    {post.excerpt}
                  </p>
                  <a
                    href="#"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-heading transition-colors hover:text-sand"
                  >
                    Read More <ArrowRight size={14} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
