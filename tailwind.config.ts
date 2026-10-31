import type { Config } from 'tailwindcss';

/**
 * Figma Dual-Mode Design System Tokens:
 * - Dark Mode ("Carpathian Karst & Subterranean Heritage"): Deep basalt, wet slate, travertine text, sump emerald
 * - Light Mode ("Sunlit Travertine & Alpine Limestone"): Warm sunlit parchment, alabaster cards, forest basalt ink, pine green
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
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        display: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        editorial:
          '0 20px 45px -15px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(226, 217, 200, 0.06)',
        'editorial-hover':
          '0 24px 50px -12px rgba(0, 0, 0, 0.78), 0 0 0 1px rgba(111, 179, 135, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
