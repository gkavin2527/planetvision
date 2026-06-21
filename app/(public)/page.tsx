import HeroBanner from '@/components/home/HeroBanner'
import SearchBar from '@/components/home/SearchBar'
import StatsStrip from '@/components/home/StatsStrip'
import FeaturedProperties from '@/components/home/FeaturedProperties'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import ServicesShowcase from '@/components/home/ServicesShowcase'
import Testimonials from '@/components/home/Testimonials'
import CallToAction from '@/components/home/CallToAction'
import { getFeaturedProperties } from '@/lib/queries'

export default async function HomePage() {
  const featured = await getFeaturedProperties(6)

  return (
    <>
      <HeroBanner />
      <SearchBar />
      <StatsStrip />
      <WhyChooseUs />
      <FeaturedProperties properties={featured} />
      <ServicesShowcase />
      <Testimonials />
      <CallToAction />
    </>
  )
}
