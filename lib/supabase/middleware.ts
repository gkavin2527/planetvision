import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type CookieToSet = { name: string; value: string; options: CookieOptions }

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isLoginRoute = pathname === '/admin/login'
  const isAdminArea = pathname.startsWith('/admin') && !isLoginRoute

  // Unauthenticated users hitting the admin area go to the login page.
  if (isAdminArea && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Only look up the role when there's a session on an admin-related route.
  let role: string | null = null
  if (user && (isAdminArea || isLoginRoute)) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
    role = data?.role ?? null
  }

  // Authenticated non-admins are sent back to the public site.
  if (isAdminArea && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Logged-in users on the login page go where they belong.
  if (isLoginRoute && user) {
    return NextResponse.redirect(
      new URL(role === 'admin' ? '/admin' : '/', request.url)
    )
  }

  return supabaseResponse
}
