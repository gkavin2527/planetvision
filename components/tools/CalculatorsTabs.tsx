'use client'

import { useState } from 'react'
import { Calculator, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import MortgageCalculator from '@/components/tools/MortgageCalculator'
import AffordabilityCalculator from '@/components/tools/AffordabilityCalculator'

const TABS = [
  { id: 'mortgage', label: 'Mortgage', icon: Calculator },
  { id: 'affordability', label: 'Affordability', icon: Wallet },
] as const

export default function CalculatorsTabs({
  initial = 'mortgage',
}: {
  initial?: (typeof TABS)[number]['id']
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>(initial)

  return (
    <div>
      <div className="mb-8 inline-flex rounded-full border border-line bg-surface p-1">
        {TABS.map((t) => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-bark text-white dark:bg-sand dark:text-bark'
                  : 'text-body hover:text-heading'
              )}
            >
              <Icon size={16} />
              {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'mortgage' ? <MortgageCalculator /> : <AffordabilityCalculator />}
    </div>
  )
}
