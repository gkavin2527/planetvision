import type { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import InquiryForm from '@/components/properties/InquiryForm'
import Accordion from '@/components/ui/Accordion'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the PlanetVision team.',
}

const details = [
  {
    icon: MapPin,
    label: 'Visit Us',
    value: '200 Biscayne Blvd, Miami, FL 33131',
  },
  { icon: Phone, label: 'Call Us', value: '+1 (305) 555-0142' },
  { icon: Mail, label: 'Email Us', value: 'hello@planetvision.com' },
  { icon: Clock, label: 'Hours', value: 'Mon–Sat, 9:00 AM – 7:00 PM' },
]

const faqs = [
  {
    q: 'How do I schedule a property viewing?',
    a: 'Submit an inquiry through any listing or this contact form, and a dedicated advisor will arrange a private viewing at your convenience.',
  },
  {
    q: 'Do you work with international buyers?',
    a: 'Absolutely. A significant portion of our clientele is international, and we offer tailored support throughout the entire purchase process.',
  },
  {
    q: 'Are your listings available for rent as well as sale?',
    a: 'Yes. Our portfolio includes both premium sales and luxury rentals. Use the listing filters to browse by type.',
  },
  {
    q: 'What areas do you cover?',
    a: 'We specialize in prime markets including Miami, New York, Los Angeles, Chicago, and Houston, with select properties worldwide.',
  },
]

export default function ContactPage() {
  return (
    <>
      <section className="bg-bark pt-32 pb-16">
        <div className="container-content">
          <span className="eyebrow !text-sand">Get In Touch</span>
          <h1 className="mt-3 font-playfair text-hero !text-white">
            Let&apos;s Talk
          </h1>
          <p className="mt-4 max-w-xl text-lg font-light text-white/70">
            Whether you&apos;re buying, selling, or simply exploring, our team is
            here to help.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container-content grid grid-cols-1 gap-14 lg:grid-cols-2">
          {/* Form */}
          <div>
            <h2 className="font-playfair text-2xl text-heading">
              Send Us a Message
            </h2>
            <p className="mt-2 text-sm text-muted">
              Fill out the form and we&apos;ll respond within one business day.
            </p>
            <div className="mt-8">
              <InquiryForm />
            </div>
          </div>

          {/* Details + map */}
          <div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {details.map((d) => (
                <div
                  key={d.label}
                  className="rounded-card bg-cream-dark p-6"
                >
                  <d.icon className="text-sand" size={22} />
                  <p className="mt-4 text-xs uppercase tracking-[0.1em] text-muted">
                    {d.label}
                  </p>
                  <p className="mt-1 text-sm text-heading">{d.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-card">
              <iframe
                title="Office location"
                width="100%"
                height="300"
                loading="lazy"
                className="border-0"
                src="https://www.google.com/maps?q=200+Biscayne+Blvd+Miami+FL&output=embed"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream-dark py-24">
        <div className="container-content max-w-3xl">
          <div className="text-center">
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-3 text-h2">Frequently Asked Questions</h2>
          </div>
          <div className="mt-12">
            <Accordion items={faqs} />
          </div>
        </div>
      </section>
    </>
  )
}
