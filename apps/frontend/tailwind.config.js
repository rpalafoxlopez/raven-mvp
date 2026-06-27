/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Dorado — acento primario (CTAs, énfasis, líneas decorativas)
        solstis: '#C9A227',
        'solstis-deep': '#A6841C',
        'solstis-pale': '#E8D690',
        // Negro — texto y acentos estructurales (ya no es el fondo base)
        folsom: '#0A0A0A',
        carbon: '#1A1A1A',
        // Blanco/superficie — ahora es el color dominante de fondo
        loriga: '#FFFFFF',
        'loriga-soft': '#FAF8F3',   // blanco cálido para separar secciones
        halford: '#6B6B63',         // texto secundario sobre blanco
        vegas: '#9A9A8E',
        bocanada: '#0A0A0A',        // alias retrocompatible -> negro
        rock: {
          50: '#FAF8F3',
          100: '#F5EFD8',
          200: '#EBDDA8',
          300: '#DCC571',
          400: '#D2B348',
          500: '#C9A227',
          600: '#A6841C',
          700: '#856815',
          800: '#5E4A0F',
          900: '#3D300A',
          950: '#1F1805'
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