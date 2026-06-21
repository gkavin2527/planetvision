'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutGrid,
  Building2,
  Mail,
  ExternalLink,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutGrid, exact: true },
  { href: '/admin/properties', label: 'Properties', icon: Building2 },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Mail },
]

export default function AdminShell({
  children,
  email,
  role,
}: {
  children: React.ReactNode
  email?: string | null
  role?: string | null
}) {
  const pathname = usePathname()
  const router = useRouter()

  // Login page renders without the sidebar chrome
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (item: (typeof navItems)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="fixed inset-y-0 left-0 flex w-64 flex-col bg-bark text-white">
        <div className="px-6 py-7">
          <Link
            href="/admin"
            className="font-inter text-lg font-bold tracking-tight"
          >
            PLANETVISION
          </Link>
          <p className="mt-1 text-[0.6875rem] uppercase tracking-[0.1em] text-white/40">
            Admin Portal
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors',
                isActive(item)
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        {email && (
          <div className="mx-3 mb-1 rounded-sm bg-white/5 px-3 py-3">
            <p className="truncate text-sm text-white/90">{email}</p>
            <span className="mt-1 inline-flex items-center rounded-full bg-sand/20 px-2 py-0.5 text-[0.625rem] font-medium uppercase tracking-[0.1em] text-sand">
              {role ?? 'user'}
            </span>
          </div>
        )}

        <div className="space-y-1 border-t border-white/10 px-3 py-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink size={18} />
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="ml-64 flex-1">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
