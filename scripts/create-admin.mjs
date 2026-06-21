/**
 * Create (or update) a Supabase Auth admin user.
 *
 * Usage:
 *   node --env-file=.env.local scripts/create-admin.mjs
 *   node --env-file=.env.local scripts/create-admin.mjs you@example.com 'YourPassw0rd!'
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the env.
 * The service role key bypasses RLS — never expose it to the browser.
 */
import { createClient } from '@supabase/supabase-js'

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

if (!url || !serviceKey) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n' +
      'Run with: node --env-file=.env.local scripts/create-admin.mjs'
  )
  process.exit(1)
}

const email = process.argv[2] || 'admin@urbannest.com'
const password = process.argv[3] || 'Admin@123'

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Is there already a user with this email?
const { data: list, error: listError } = await supabase.auth.admin.listUsers()
if (listError) {
  console.error('Failed to list users:', listError.message)
  process.exit(1)
}

const existing = list.users.find(
  (u) => u.email?.toLowerCase() === email.toLowerCase()
)

if (existing) {
  // Reset the password and ensure the email is confirmed.
  const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
  })
  if (error) {
    console.error('Failed to update user:', error.message)
    process.exit(1)
  }
  console.log(`✓ Updated existing user ${data.user.email} (${data.user.id})`)
} else {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // pre-confirm so they can log in immediately
  })
  if (error) {
    console.error('Failed to create user:', error.message)
    process.exit(1)
  }
  console.log(`✓ Created admin user ${data.user.email} (${data.user.id})`)
}
