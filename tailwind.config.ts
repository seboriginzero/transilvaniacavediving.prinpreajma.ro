import type { Config } from 'tailwindcss';

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
          950: '#12110E',
          900: '#191714',
          800: '#24201B',
          700: '#352F28',
          600: '#4A4238',
          500: '#665B4E',
        },
        limestone: {
          50: '#FDFBF7',
          100: '#F5EFE4',
          200: '#E5DCCB',
          300: '#C7BDA8',
          400: '#9A8F7A',
        },
        karst: {
          400: '#74B48B',
          500: '#52946B',
          600: '#3F7A56',
          700: '#2F5E41',
        },
        safety: {
          400: '#DFA055',
          500: '#C67D33',
          600: '#A36120',
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
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};

export default config;
