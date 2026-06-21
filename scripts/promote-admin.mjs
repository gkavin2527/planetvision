/**
 * Promote an existing auth user to the `admin` role (or demote to `user`).
 * Run this AFTER applying supabase/profiles.sql.
 *
 * Usage:
 *   node --env-file=.env.local scripts/promote-admin.mjs
 *   node --env-file=.env.local scripts/promote-admin.mjs you@example.com
 *   node --env-file=.env.local scripts/promote-admin.mjs you@example.com user
 *
 * Uses the service role key, which bypasses RLS — server-side only.
 */
import { createClient } from '@supabase/supabase-js'

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

if (!url || !serviceKey) {
  console.error(
    'Missing env. Run with: node --env-file=.env.local scripts/promote-admin.mjs'
  )
  process.exit(1)
}

const email = process.argv[2] || 'admin@urbannest.com'
const role = process.argv[3] || 'admin'

if (!['admin', 'user'].includes(role)) {
  console.error("Role must be 'admin' or 'user'")
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Find the auth user by email
const { data: list, error: listError } = await supabase.auth.admin.listUsers()
if (listError) {
  console.error('Failed to list users:', listError.message)
  process.exit(1)
}
const authUser = list.users.find(
  (u) => u.email?.toLowerCase() === email.toLowerCase()
)
if (!authUser) {
  console.error(`No auth user found for ${email}. Create them first.`)
  process.exit(1)
}

// Upsert the profile row with the desired role (backfills if missing)
const { data, error } = await supabase
  .from('profiles')
  .upsert(
    { id: authUser.id, email: authUser.email, role },
    { onConflict: 'id' }
  )
  .select('id, email, role')
  .single()

if (error) {
  console.error('Failed to set role:', error.message)
  console.error('Did you run supabase/profiles.sql first?')
  process.exit(1)
}

console.log(`✓ ${data.email} is now '${data.role}' (${data.id})`)
