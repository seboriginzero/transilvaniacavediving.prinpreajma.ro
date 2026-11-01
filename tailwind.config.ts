import type { Config } from 'tailwindcss';

/**
 * Figma Dual-Mode Design System Tokens:
 * - Editorial Mountaineering / Leica / NatGeo Minimalist Palette
 * - High-contrast typography & architectural grid
 */
const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cavern: {
          950: 'rgb(var(--cavern-950) / <alpha-value>)',
          900: 'rgb(var(--cavern-900) / <alpha-value>)',
          800: 'rgb(var(--cavern-800) / <alpha-value>)',
          700: 'rgb(var(--cavern-700) / <alpha-value>)',
          600: 'rgb(var(--cavern-600) / <alpha-value>)',
          500: 'rgb(var(--cavern-500) / <alpha-value>)',
        },
        limestone: {
          50: 'rgb(var(--limestone-50) / <alpha-value>)',
          100: 'rgb(var(--limestone-100) / <alpha-value>)',
          200: 'rgb(var(--limestone-200) / <alpha-value>)',
          300: 'rgb(var(--limestone-300) / <alpha-value>)',
          400: 'rgb(var(--limestone-400) / <alpha-value>)',
        },
        karst: {
          300: 'rgb(var(--karst-300) / <alpha-value>)',
          400: 'rgb(var(--karst-400) / <alpha-value>)',
          500: 'rgb(var(--karst-500) / <alpha-value>)',
          600: 'rgb(var(--karst-600) / <alpha-value>)',
          700: 'rgb(var(--karst-700) / <alpha-value>)',
        },
        safety: {
          300: 'rgb(var(--safety-300) / <alpha-value>)',
          400: 'rgb(var(--safety-400) / <alpha-value>)',
          500: 'rgb(var(--safety-500) / <alpha-value>)',
          600: 'rgb(var(--safety-600) / <alpha-value>)',
        },
        marble: {
          500: 'rgb(var(--marble-500) / <alpha-value>)',
          600: 'rgb(var(--marble-600) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          'system-ui',
          'sans-serif',
        ],
        display: [
          '"Playfair Display"',
          '"New York"',
          'Charter',
          'Baskerville',
          'Georgia',
          'serif',
        ],
        serif: [
          '"Playfair Display"',
          '"New York"',
          'Charter',
          'Georgia',
          'serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"SF Mono"',
          'Menlo',
          'ui-monospace',
          'monospace',
        ],
      },
      boxShadow: {
        'figma-subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'figma-card': '0 4px 20px -2px rgba(0, 0, 0, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.08)',
        'figma-card-dark': '0 12px 32px -4px rgba(0, 0, 0, 0.5), 0 4px 12px -2px rgba(0, 0, 0, 0.4)',
        'figma-elevated': '0 20px 40px -8px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
