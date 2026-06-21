/**
 * Lightweight className combiner (avoids extra deps).
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Format a numeric price. For-rent prices are shown per-month.
 */
export function formatPrice(price: number, priceType: 'sale' | 'rent' = 'sale'): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)

  return priceType === 'rent' ? `${formatted}/mo` : formatted
}

/**
 * Format an area value in square feet.
 */
export function formatArea(area: number): string {
  return `${new Intl.NumberFormat('en-US').format(area)} sq ft`
}

/**
 * Human-friendly date, e.g. "Jan 15, 2025".
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Truncate text to a max length with an ellipsis.
 */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max).trimEnd()}…`
}

/**
 * Map property_type values to readable labels.
 */
export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'house', label: 'House' },
] as const

export function propertyTypeLabel(type: string): string {
  return PROPERTY_TYPES.find((t) => t.value === type)?.label ?? type
}
