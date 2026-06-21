'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !user) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    // Authorize: only admins may use the portal.
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.role !== 'admin') {
      await supabase.auth.signOut()
      setError('This account does not have admin access.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bark px-4">
      <div className="w-full max-w-md rounded-sm bg-cream p-10 shadow-2xl">
        <h1 className="text-center font-inter text-2xl font-bold tracking-tight text-heading">
          PLANETVISION
        </h1>
        <p className="mt-2 text-center text-sm uppercase tracking-[0.2em] text-muted">
          Admin Portal
        </p>

        {error && (
          <p className="mt-6 text-center text-sm text-red-500">{error}</p>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-sm border border-sand bg-cream-dark px-4 py-3 text-heading focus:border-bark focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-sm border border-sand bg-cream-dark px-4 py-3 text-heading focus:border-bark focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-bark py-3 font-medium text-white transition-colors hover:bg-bark-mid disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          Demo: admin@urbannest.com · Admin@123
        </p>
      </div>
    </div>
  )
}
