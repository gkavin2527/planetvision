import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Property, Inquiry, PropertyFilters, Profile } from '@/types'

/**
 * Returns true when Supabase env vars are present. Lets the UI render
 * gracefully (empty states) before the backend is configured.
 */
function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  if (!isConfigured()) return []
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)
    return (data as Property[]) ?? []
  } catch {
    return []
  }
}

export async function getProperties(filters: PropertyFilters = {}): Promise<{
  properties: Property[]
  total: number
  pages: number
  page: number
}> {
  const page = filters.page ?? 1
  const limit = filters.limit ?? 9
  if (!isConfigured()) return { properties: [], total: 0, pages: 0, page }

  try {
    const supabase = createClient()
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase.from('properties').select('*', { count: 'exact' })

    if (filters.city) query = query.ilike('city', `%${filters.city}%`)
    if (filters.property_type)
      query = query.eq('property_type', filters.property_type)
    if (filters.price_min) query = query.gte('price', filters.price_min)
    if (filters.price_max) query = query.lte('price', filters.price_max)
    if (filters.bedrooms) query = query.gte('bedrooms', filters.bedrooms)
    if (filters.bathrooms) query = query.gte('bathrooms', filters.bathrooms)
    if (filters.area_min) query = query.gte('area', filters.area_min)
    if (filters.price_type) query = query.eq('price_type', filters.price_type)
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.featured) query = query.eq('featured', true)
    if (filters.keyword) {
      const k = filters.keyword.replace(/[%,]/g, ' ')
      query = query.or(
        `title.ilike.%${k}%,description.ilike.%${k}%,location.ilike.%${k}%`
      )
    }

    if (filters.sort === 'price_asc') query = query.order('price', { ascending: true })
    else if (filters.sort === 'price_desc') query = query.order('price', { ascending: false })
    else if (filters.sort === 'featured') query = query.order('featured', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const { data, count } = await query.range(from, to)
    return {
      properties: (data as Property[]) ?? [],
      total: count ?? 0,
      pages: Math.ceil((count ?? 0) / limit),
      page,
    }
  } catch {
    return { properties: [], total: 0, pages: 0, page }
  }
}

export async function getProperty(id: string): Promise<Property | null> {
  if (!isConfigured()) return null
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()
    return (data as Property) ?? null
  } catch {
    return null
  }
}

export async function getSimilarProperties(
  city: string,
  excludeId: string,
  limit = 3
): Promise<Property[]> {
  if (!isConfigured()) return []
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('city', city)
      .neq('id', excludeId)
      .limit(limit)
    return (data as Property[]) ?? []
  } catch {
    return []
  }
}

/**
 * Comparable listings (same city, ideally same type) used to derive the
 * "PlanetVision Estimate" — a transparent price-per-sqft valuation, not a
 * proprietary model. Returns the raw comps so the caller can compute.
 */
export async function getComparables(
  city: string,
  propertyType: string,
  excludeId: string,
  limit = 30
): Promise<Property[]> {
  if (!isConfigured()) return []
  try {
    const supabase = createClient()
    // Prefer same-type comps; fall back to city-wide if too few.
    const { data: typed } = await supabase
      .from('properties')
      .select('*')
      .eq('city', city)
      .eq('property_type', propertyType)
      .eq('price_type', 'sale')
      .neq('id', excludeId)
      .limit(limit)
    if (typed && typed.length >= 3) return typed as Property[]

    const { data: cityWide } = await supabase
      .from('properties')
      .select('*')
      .eq('city', city)
      .eq('price_type', 'sale')
      .neq('id', excludeId)
      .limit(limit)
    return (cityWide as Property[]) ?? []
  } catch {
    return []
  }
}

export async function getInquiries(): Promise<Inquiry[]> {
  if (!isConfigured()) return []
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('inquiries')
      .select('*, property:properties(title, city)')
      .order('created_at', { ascending: false })
    return (data as Inquiry[]) ?? []
  } catch {
    return []
  }
}

export async function getAllPropertiesAdmin(): Promise<Property[]> {
  if (!isConfigured()) return []
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    return (data as Property[]) ?? []
  } catch {
    return []
  }
}

export async function getCurrentProfile(): Promise<Profile | null> {
  if (!isConfigured()) return null
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
    return (data as Profile) ?? null
  } catch {
    return null
  }
}

export async function getDashboardStats() {
  const empty = {
    totalProps: 0,
    featuredProps: 0,
    totalInquiries: 0,
    newInquiries: 0,
  }
  if (!isConfigured()) return empty
  try {
    const supabase = createClient()
    const [props, featured, inquiries, newInq] = await Promise.all([
      supabase.from('properties').select('*', { count: 'exact', head: true }),
      supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('featured', true),
      supabase.from('inquiries').select('*', { count: 'exact', head: true }),
      supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new'),
    ])
    return {
      totalProps: props.count ?? 0,
      featuredProps: featured.count ?? 0,
      totalInquiries: inquiries.count ?? 0,
      newInquiries: newInq.count ?? 0,
    }
  } catch {
    return empty
  }
}
