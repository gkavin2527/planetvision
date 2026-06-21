import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const admin = await requireAdmin(supabase)
  if (!admin)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
  const { data, error } = await supabase.storage
    .from('property-images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const {
    data: { publicUrl },
  } = supabase.storage.from('property-images').getPublicUrl(data.path)

  return NextResponse.json({ url: publicUrl })
}
