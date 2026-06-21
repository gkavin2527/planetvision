import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware tokens (flip in dark mode via CSS variables). Stored as
        // "R G B" channels + <alpha-value> so opacity modifiers work, e.g.
        // bg-cream/85, bg-surface/90, text-heading/80.
        cream: {
          DEFAULT: 'rgb(var(--cream) / <alpha-value>)',
          dark: 'rgb(var(--cream-dark) / <alpha-value>)',
        },
        surface: 'rgb(var(--surface) / <alpha-value>)',
        heading: 'rgb(var(--heading) / <alpha-value>)',
        body: 'rgb(var(--text-body) / <alpha-value>)',
        muted: 'rgb(var(--text-muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        // Constant brand colors (never flip — used for dark UI + accent)
        bark: {
          DEFAULT: '#2C2416',
          mid: '#3D3020',
        },
        sand: '#C4A882',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(3rem, 6vw, 5.5rem)', { lineHeight: '1.05' }],
        h2: ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.1' }],
        label: ['0.6875rem', { letterSpacing: '0.1em' }],
      },
      borderRadius: {
        card: '2px',
      },
      maxWidth: {
        content: '1280px',
      },
      boxShadow: {
        card: '0 8px 40px rgba(0,0,0,0.12)',
        'card-hover': '0 20px 50px rgba(0,0,0,0.18)',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

export default config
