import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const body = await req.json()

  // Whitelist fields the public can submit
  const payload = {
    name: body.name,
    email: body.email,
    phone: body.phone || null,
    message: body.message,
    property_id: body.property_id || null,
  }

  if (!payload.name || !payload.email || !payload.message) {
    return NextResponse.json(
      { error: 'Name, email, and message are required.' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('inquiries')
    .insert(payload)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET() {
  const supabase = createClient()
  const admin = await requireAdmin(supabase)
  if (!admin)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data, error } = await supabase
    .from('inquiries')
    .select('*, property:properties(title, city)')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
