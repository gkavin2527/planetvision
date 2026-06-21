'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { affordableHomePrice, monthlyBreakdown, money } from '@/lib/finance'

function Field({
  label,
  prefix,
  suffix,
  value,
  onChange,
  step = 1,
}: {
  label: string
  prefix?: string
  suffix?: string
  value: number
  onChange: (v: number) => void
  step?: number
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-1.5 block">{label}</span>
      <div className="flex items-center rounded-sm border border-sand bg-surface px-3 focus-within:border-bark">
        {prefix && <span className="text-sm text-muted">{prefix}</span>}
        <input
          type="number"
          step={step}
          value={Number.isFinite(value) ? value : ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent px-2 py-2.5 text-sm text-heading focus:outline-none"
        />
        {suffix && <span className="text-sm text-muted">{suffix}</span>}
      </div>
    </label>
  )
}

export default function AffordabilityCalculator() {
  const [income, setIncome] = useState(180000)
  const [debts, setDebts] = useState(600)
  const [down, setDown] = useState(120000)
  const [rate, setRate] = useState(6.75)
  const [years, setYears] = useState(30)

  const price = useMemo(
    () =>
      affordableHomePrice({
        annualIncome: income,
        monthlyDebts: debts,
        downPayment: down,
        rate,
        years,
      }),
    [income, debts, down, rate, years]
  )

  const payment = useMemo(
    () => monthlyBreakdown({ price, downPayment: down, rate, years }).total,
    [price, down, rate, years]
  )

  return (
    <div className="grid gap-8 rounded-card bg-surface p-8 shadow-card lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-4">
        <Field label="Annual household income" prefix="$" step={1000} value={income} onChange={setIncome} />
        <Field label="Monthly debts (car, loans, cards)" prefix="$" step={50} value={debts} onChange={setDebts} />
        <Field label="Down payment" prefix="$" step={1000} value={down} onChange={setDown} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Interest rate" suffix="%" step={0.01} value={rate} onChange={setRate} />
          <label className="block">
            <span className="eyebrow mb-1.5 block">Loan term</span>
            <select
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full rounded-sm border border-sand bg-surface px-3 py-2.5 text-sm text-heading focus:border-bark focus:outline-none"
            >
              {[30, 20, 15].map((t) => (
                <option key={t} value={t}>
                  {t} years
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="text-xs leading-relaxed text-muted">
          Based on the 28/36 debt-to-income guideline lenders commonly use. A
          real pre-approval depends on credit, reserves and lender terms.
        </p>
      </div>

      <div className="flex flex-col justify-center rounded-card bg-cream-dark p-6 text-center">
        <p className="eyebrow">You can likely afford a home up to</p>
        <p className="mt-2 font-playfair text-5xl text-heading">{money(price)}</p>
        <p className="mt-2 text-sm text-body">
          at about <span className="font-medium text-heading">{money(payment)}</span>/mo
        </p>
        <Link
          href={`/properties?priceMax=${Math.round(price)}`}
          className="btn-primary mt-6 self-center"
        >
          Browse homes in budget
        </Link>
      </div>
    </div>
  )
}
