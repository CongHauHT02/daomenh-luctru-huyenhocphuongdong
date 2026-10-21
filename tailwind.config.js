/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070a0e',
          900: '#0b0f14',
          850: '#10161e',
          800: '#161f2b',
          700: '#232f3e',
          600: '#344558',
        },
        gold: {
          300: '#f9e498',
          400: '#edd06c',
          500: '#d4af37', // Imperial Gold
          600: '#b89225',
          700: '#8c6b16',
        },
        jade: {
          900: '#061a18',
          800: '#0a2e2b',
          700: '#114a45',
          600: '#156b64',
          500: '#10b981',
          400: '#34d399',
        },
        cinnabar: {
          600: '#b91c1c',
          500: '#dc2626',
          400: '#ef4444',
        },
        parchment: {
          50: '#fbf9f4',
          100: '#f5f0e3',
          200: '#ebdcc5',
          300: '#dec4a2',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        'jade-glow': '0 0 25px -5px rgba(16, 185, 129, 0.2)',
      }
    },
  },
  plugins: [],
}
