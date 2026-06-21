import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider, themeInitScript } from '@/components/theme/ThemeProvider'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600'],
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: {
    default: 'PlanetVision — Premium Luxury Real Estate',
    template: '%s · PlanetVision',
  },
  description:
    'A vision that transcends property and space, where unmatched craftsmanship inspires elegance and innovation to enrich lives.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'PlanetVision — Premium Luxury Real Estate',
    description:
      'A vision that transcends property and space, where unmatched craftsmanship inspires elegance and innovation to enrich lives.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-inter antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
