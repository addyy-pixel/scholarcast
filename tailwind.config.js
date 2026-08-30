/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scholars: {
          50: '#f0f4ff',
          100: '#e0e8ff',
          200: '#c5d5fe',
          500: '#0284c7',
          600: '#0369a1',
          700: '#1d4ed8',
          800: '#1b4996',
          900: '#0f2952',
          950: '#091833',
        }
      }
    },
  },
  plugins: [],
}
