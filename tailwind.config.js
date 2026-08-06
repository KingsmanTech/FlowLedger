const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Geist is injected via the `geist/font/sans` variable from app/layout.tsx
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        // Soft studio-style elevation used on form cards
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 6px 24px -8px rgb(0 0 0 / 0.08)',
        // Elevation for the floating A4 sheet preview
        sheet: '0 1px 2px 0 rgb(0 0 0 / 0.05), 0 16px 40px -16px rgb(0 0 0 / 0.18)',
      },
    },
  },
  plugins: [],
};
