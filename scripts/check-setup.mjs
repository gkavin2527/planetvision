/**
 * Verifies the Supabase backend is set up correctly.
 *   node --env-file=.env.local scripts/check-setup.mjs
 */
import { createClient } from '@supabase/supabase-js'

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()

if (!url || !serviceKey) {
  console.error('Missing env (need URL + service role key).')
  process.exit(1)
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const ok = (m) => console.log(`  ✓ ${m}`)
const bad = (m) => console.log(`  ✗ ${m}`)

async function tableCount(table) {
  const { count, error } = await admin
    .from(table)
    .select('*', { count: 'exact', head: true })
  return { count, error }
}

console.log('\nURL:', url, anonKey ? '(anon key present)' : '(NO anon key)')

console.log('\nTables:')
for (const t of ['properties', 'inquiries', 'profiles']) {
  const { count, error } = await tableCount(t)
  if (error) bad(`${t} — ${error.message}`)
  else ok(`${t} — ${count} rows`)
}

console.log('\nAdmin users (role = admin):')
const { data: admins, error: adminErr } = await admin
  .from('profiles')
  .select('email, role')
  .eq('role', 'admin')
if (adminErr) bad(adminErr.message)
else if (!admins.length) bad('none found — run scripts/promote-admin.mjs')
else admins.forEach((a) => ok(`${a.email}`))

console.log('')
