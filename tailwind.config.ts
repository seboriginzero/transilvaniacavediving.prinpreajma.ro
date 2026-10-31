import type { Config } from 'tailwindcss';

/**
 * Figma Design System Tokens — "Carpathian Karst & Subterranean Heritage"
 * Natural warm limestone, subterranean basalt, Codru-Moma forest/sump emerald,
 * and aragonite headlamp amber. Designed for high legibility and organic warmth.
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cavern: {
          950: '#11100E',
          900: '#171512',
          800: '#211E1A',
          700: '#332E27',
          600: '#494138',
          500: '#665B4E',
        },
        limestone: {
          50: '#FDFBF7',
          100: '#F4EFE6',
          200: '#E2D9C8',
          300: '#C2B6A1',
          400: '#968A76',
        },
        karst: {
          300: '#94CCA7',
          400: '#6FB387',
          500: '#4E9468',
          600: '#3A7852',
          700: '#2B5C3E',
        },
        safety: {
          300: '#ECC082',
          400: '#DFA255',
          500: '#C67F32',
          600: '#9E611E',
        },
        marble: {
          500: '#8C2D2D',
          600: '#6E2020',
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
