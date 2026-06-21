/**
 * Mortgage / affordability math — pure functions, no external services.
 * Used by the listing cards, the property detail "estimate", and the
 * standalone calculators page.
 */

export type MortgageInput = {
  price: number
  downPayment: number // absolute dollars
  rate: number // annual interest %, e.g. 6.5
  years: number // loan term in years
  taxPct?: number // annual property tax as % of price
  insuranceYr?: number // annual homeowners insurance, dollars
  hoaMonthly?: number // monthly HOA dues, dollars
}

export type MortgageBreakdown = {
  loanAmount: number
  principalInterest: number
  tax: number
  insurance: number
  hoa: number
  total: number
}

/**
 * Standard amortized monthly principal + interest payment.
 *   M = P · r(1+r)^n / ((1+r)^n − 1)
 */
export function principalAndInterest(
  loanAmount: number,
  annualRatePct: number,
  years: number
): number {
  if (loanAmount <= 0) return 0
  const n = years * 12
  const r = annualRatePct / 100 / 12
  if (r === 0) return loanAmount / n
  const factor = Math.pow(1 + r, n)
  return (loanAmount * (r * factor)) / (factor - 1)
}

/** Full monthly breakdown (P&I + tax + insurance + HOA). */
export function monthlyBreakdown(input: MortgageInput): MortgageBreakdown {
  const {
    price,
    downPayment,
    rate,
    years,
    taxPct = 1.1,
    insuranceYr = 1200,
    hoaMonthly = 0,
  } = input

  const loanAmount = Math.max(price - downPayment, 0)
  const pi = principalAndInterest(loanAmount, rate, years)
  const tax = (price * (taxPct / 100)) / 12
  const insurance = insuranceYr / 12
  const hoa = hoaMonthly

  return {
    loanAmount,
    principalInterest: pi,
    tax,
    insurance,
    hoa,
    total: pi + tax + insurance + hoa,
  }
}

/**
 * Quick estimated monthly payment shown on listing cards — assumes a
 * 20% down payment, 30-year term, and a default rate. For rentals the
 * monthly payment is simply the rent.
 */
export function estimatedMonthly(
  price: number,
  priceType: 'sale' | 'rent' = 'sale',
  opts: { downPct?: number; rate?: number; years?: number } = {}
): number {
  if (priceType === 'rent') return price
  const { downPct = 20, rate = 6.75, years = 30 } = opts
  const down = price * (downPct / 100)
  return monthlyBreakdown({ price, downPayment: down, rate, years }).total
}

/** Price per square foot. */
export function pricePerSqft(price: number, area: number): number {
  if (!area) return 0
  return price / area
}

/**
 * Maximum home price a buyer can afford given income, debts and a down
 * payment, using the common 28/36 DTI rule (housing ≤ 28% of gross,
 * total debt ≤ 36%). Returns the binding home price.
 */
export function affordableHomePrice(input: {
  annualIncome: number
  monthlyDebts: number
  downPayment: number
  rate: number
  years: number
  taxPct?: number
  insuranceYr?: number
}): number {
  const {
    annualIncome,
    monthlyDebts,
    downPayment,
    rate,
    years,
    taxPct = 1.1,
    insuranceYr = 1200,
  } = input

  const grossMonthly = annualIncome / 12
  // The lower of the two DTI ceilings governs the housing budget.
  const housingCap = grossMonthly * 0.28
  const totalDebtCap = grossMonthly * 0.36 - monthlyDebts
  let housingBudget = Math.min(housingCap, totalDebtCap)
  if (housingBudget <= 0) return downPayment

  // Carve out tax + insurance (price-dependent) by solving iteratively.
  const n = years * 12
  const r = rate / 100 / 12
  const piFactor = r === 0 ? 1 / n : (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)

  // Newton-free fixed-point: start from a guess, refine a few times.
  let price = downPayment + housingBudget / piFactor
  for (let i = 0; i < 25; i++) {
    const tax = (price * (taxPct / 100)) / 12
    const ins = insuranceYr / 12
    const piBudget = Math.max(housingBudget - tax - ins, 0)
    const loan = piBudget / piFactor
    price = loan + downPayment
  }
  return Math.max(price, downPayment)
}

/**
 * Comparable-based value estimate. Uses the median price-per-sqft of
 * comparable for-sale listings × this home's area. Returns null when there
 * aren't enough comps to be meaningful. This is a transparent heuristic —
 * not a proprietary AVM.
 */
export function estimateValue(
  area: number,
  comps: { price: number; area: number; price_type?: string }[]
): { value: number; ppsf: number; sampleSize: number } | null {
  const ppsfs = comps
    .filter((c) => (c.price_type ?? 'sale') === 'sale' && c.area > 0 && c.price > 0)
    .map((c) => c.price / c.area)
    .sort((a, b) => a - b)
  if (ppsfs.length < 3 || !area) return null
  const mid = Math.floor(ppsfs.length / 2)
  const medianPpsf =
    ppsfs.length % 2 ? ppsfs[mid] : (ppsfs[mid - 1] + ppsfs[mid]) / 2
  return { value: medianPpsf * area, ppsf: medianPpsf, sampleSize: ppsfs.length }
}

/** Compact currency, e.g. $1.25M / $850K / $4,200. */
export function compactPrice(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 2)}M`
  }
  if (value >= 1_000) {
    return `$${Math.round(value / 1_000)}K`
  }
  return `$${Math.round(value)}`
}

/** Currency with no decimals, e.g. $3,184. */
export function money(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}
