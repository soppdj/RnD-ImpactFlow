/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Soft Hijau Tosca Palette (Startup Vibe)
        brand: {
          50: '#f0fdfa',  // Ultra soft tosca-white
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Fresh Tosca
          600: '#0d9488', // Primary Hijau Tosca
          700: '#0f766e', // Deep Tosca
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e'
        },
        tosca: {
          light: '#5eead4',
          DEFAULT: '#0d9488',
          dark: '#0f766e',
          glow: '#99f6e4',
        },
        growth: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warm: {
          50: '#fbfcfb',
          100: '#f6f9f7',
          200: '#edf3f0',
          300: '#e1ebe6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
