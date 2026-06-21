'use client'

import { useMemo, useState } from 'react'
import { monthlyBreakdown, money } from '@/lib/finance'

const TERMS = [30, 20, 15, 10]

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

export default function MortgageCalculator({
  initialPrice = 850000,
  compact = false,
}: {
  initialPrice?: number
  compact?: boolean
}) {
  const [price, setPrice] = useState(initialPrice)
  const [downPct, setDownPct] = useState(20)
  const [rate, setRate] = useState(6.75)
  const [years, setYears] = useState(30)
  const [taxPct, setTaxPct] = useState(1.1)
  const [insuranceYr, setInsuranceYr] = useState(1200)
  const [hoaMonthly, setHoaMonthly] = useState(0)

  const downPayment = Math.round((price * downPct) / 100)

  const b = useMemo(
    () =>
      monthlyBreakdown({
        price,
        downPayment,
        rate,
        years,
        taxPct,
        insuranceYr,
        hoaMonthly,
      }),
    [price, downPayment, rate, years, taxPct, insuranceYr, hoaMonthly]
  )

  const rows = [
    { label: 'Principal & interest', value: b.principalInterest, color: 'bg-bark' },
    { label: 'Property tax', value: b.tax, color: 'bg-sand' },
    { label: 'Home insurance', value: b.insurance, color: 'bg-bark-mid' },
    ...(b.hoa > 0 ? [{ label: 'HOA dues', value: b.hoa, color: 'bg-[#9c8e7e]' }] : []),
  ]

  return (
    <div
      className={
        compact
          ? 'grid gap-6 rounded-card bg-cream-dark p-6 md:grid-cols-[1.1fr_1fr]'
          : 'grid gap-8 rounded-card bg-surface p-8 shadow-card lg:grid-cols-[1.1fr_1fr]'
      }
    >
      {/* Inputs */}
      <div className="space-y-4">
        <Field label="Home price" prefix="$" value={price} step={1000} onChange={setPrice} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Down payment" suffix="%" value={downPct} onChange={setDownPct} />
          <div>
            <span className="eyebrow mb-1.5 block">Amount</span>
            <div className="rounded-sm border border-line bg-cream-dark px-3 py-2.5 text-sm text-heading">
              {money(downPayment)}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Interest rate" suffix="%" step={0.01} value={rate} onChange={setRate} />
          <label className="block">
            <span className="eyebrow mb-1.5 block">Loan term</span>
            <select
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full rounded-sm border border-sand bg-surface px-3 py-2.5 text-sm text-heading focus:border-bark focus:outline-none"
            >
              {TERMS.map((t) => (
                <option key={t} value={t}>
                  {t} years
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Property tax" suffix="%/yr" step={0.05} value={taxPct} onChange={setTaxPct} />
          <Field label="Insurance" prefix="$" suffix="/yr" step={50} value={insuranceYr} onChange={setInsuranceYr} />
        </div>
        <Field label="HOA dues" prefix="$" suffix="/mo" step={25} value={hoaMonthly} onChange={setHoaMonthly} />
      </div>

      {/* Result */}
      <div
        className={`flex flex-col justify-center rounded-card p-6 text-center ${
          compact ? 'bg-surface' : 'bg-cream-dark'
        }`}
      >
        <p className="eyebrow">Estimated monthly payment</p>
        <p className="mt-2 font-playfair text-5xl text-heading">{money(b.total)}</p>
        <p className="mt-1 text-xs text-muted">
          {money(b.loanAmount)} loan over {years} years
        </p>

        <div className="mt-6 space-y-3 text-left">
          {/* Stacked bar */}
          <div className="flex h-2.5 overflow-hidden rounded-full">
            {rows.map((r) => (
              <div
                key={r.label}
                className={r.color}
                style={{ width: `${(r.value / b.total) * 100}%` }}
              />
            ))}
          </div>
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-body">
                <span className={`h-2.5 w-2.5 rounded-full ${r.color}`} />
                {r.label}
              </span>
              <span className="font-medium text-heading">{money(r.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
