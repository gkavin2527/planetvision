import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { UserRole } from '@/types'

/**
 * Resolves the current authenticated user and their role from the
 * `profiles` table. Used in middleware and route handlers.
 */
export async function getSessionRole(
  supabase: SupabaseClient
): Promise<{ user: User | null; role: UserRole | null }> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { user: null, role: null }

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  return { user, role: (data?.role as UserRole | undefined) ?? null }
}

/**
 * Returns the user only if they are an admin, otherwise null.
 * Use as the authorization gate in admin-only API routes.
 */
export async function requireAdmin(
  supabase: SupabaseClient
): Promise<User | null> {
  const { user, role } = await getSessionRole(supabase)
  if (!user || role !== 'admin') return null
  return user
}
