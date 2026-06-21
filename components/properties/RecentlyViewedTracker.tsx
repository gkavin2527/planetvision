'use client'

import { useEffect } from 'react'
import { useRecentlyViewed, type PropertyLite } from '@/lib/property-store'

/** Records a property view into the recently-viewed list (client only). */
export default function RecentlyViewedTracker({ lite }: { lite: PropertyLite }) {
  const { add } = useRecentlyViewed()
  useEffect(() => {
    add(lite)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lite.id])
  return null
}
