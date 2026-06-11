/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        solstis: '#D4AF37',
        folsom: '#050505',
        loriga: '#F0F5F9',
        halford: '#C0C0C0',
        vegas: '#708090',
        bocanada: '#0A192F',
        rock: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a9ba',
          400: '#ec7894',
          500: '#e11d48',
          600: '#cf1642',
          700: '#ae1037',
          800: '#921132',
          900: '#7d1430',
          950: '#450617'
        }
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}