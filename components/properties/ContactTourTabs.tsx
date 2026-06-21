'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import InquiryForm from '@/components/properties/InquiryForm'
import TourScheduler from '@/components/properties/TourScheduler'

export default function ContactTourTabs({
  propertyId,
  propertyTitle,
}: {
  propertyId: string
  propertyTitle: string
}) {
  const [tab, setTab] = useState<'tour' | 'contact'>('tour')

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-full border border-line bg-cream-dark p-1">
        {[
          { id: 'tour', label: 'Request a Tour' },
          { id: 'contact', label: 'Ask a Question' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={cn(
              'rounded-full py-2 text-sm font-medium transition-colors',
              tab === t.id
                ? 'bg-bark text-white dark:bg-sand dark:text-bark'
                : 'text-body hover:text-heading'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'tour' ? (
        <TourScheduler propertyId={propertyId} propertyTitle={propertyTitle} />
      ) : (
        <InquiryForm
          propertyId={propertyId}
          defaultMessage={`I'm interested in "${propertyTitle}". Please share more details.`}
          compact
        />
      )}
    </div>
  )
}
