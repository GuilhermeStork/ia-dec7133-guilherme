/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cs: {
          yellow: '#F0A500',
          dark: '#0A0C0F',
          card: '#12161C',
          border: '#1E2530',
          alpha: '#3B82F6',
          bravo: '#F97316',
        },
      },
    },
  },
  plugins: [],
}
