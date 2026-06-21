import AdminShell from '@/components/admin/AdminShell'
import { getCurrentProfile } from '@/lib/queries'

export const metadata = {
  title: 'Admin · PlanetVision',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getCurrentProfile()

  return (
    <AdminShell email={profile?.email ?? null} role={profile?.role ?? null}>
      {children}
    </AdminShell>
  )
}
