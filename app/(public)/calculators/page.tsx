import type { Metadata } from 'next'
import CalculatorsTabs from '@/components/tools/CalculatorsTabs'

export const metadata: Metadata = {
  title: 'Mortgage & Affordability Calculators',
  description:
    'Estimate your monthly payment and see how much home you can afford.',
}

export default function CalculatorsPage() {
  return (
    <>
      <section className="bg-bark pb-16 pt-32">
        <div className="container-content">
          <span className="eyebrow !text-sand">Plan Your Purchase</span>
          <h1 className="mt-3 font-playfair text-hero !text-white">Calculators</h1>
          <p className="mt-4 max-w-xl text-lg font-light text-white/70">
            Estimate a monthly payment or find out how much home fits your budget.
          </p>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container-content">
          <CalculatorsTabs />
        </div>
      </section>
    </>
  )
}
