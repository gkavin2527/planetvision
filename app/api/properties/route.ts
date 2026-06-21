import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(req.url)

  const city = searchParams.get('city')
  const type = searchParams.get('type')
  const priceMin = searchParams.get('priceMin')
  const priceMax = searchParams.get('priceMax')
  const bedrooms = searchParams.get('bedrooms')
  const featured = searchParams.get('featured')
  const priceType = searchParams.get('priceType')
  const sort = searchParams.get('sort') || 'newest'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '9')
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase.from('properties').select('*', { count: 'exact' })

  if (city) query = query.ilike('city', `%${city}%`)
  if (type) query = query.eq('property_type', type)
  if (priceMin) query = query.gte('price', parseFloat(priceMin))
  if (priceMax) query = query.lte('price', parseFloat(priceMax))
  if (bedrooms) query = query.gte('bedrooms', parseInt(bedrooms))
  if (featured === 'true') query = query.eq('featured', true)
  if (priceType) query = query.eq('price_type', priceType)

  if (sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else if (sort === 'featured') query = query.order('featured', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    properties: data,
    total: count,
    page,
    pages: Math.ceil((count || 0) / limit),
  })
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const admin = await requireAdmin(supabase)
  if (!admin)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { data, error } = await supabase
    .from('properties')
    .insert(body)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
