import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const admin = await requireAdmin(supabase)
  if (!admin)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { status } = await req.json()
  const { data, error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', params.id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
