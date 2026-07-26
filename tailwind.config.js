/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amex: {
          dark: '#040711',
          navy: '#070D1F',
          surface: 'rgba(15, 23, 42, 0.55)',
          gold: '#D4AF37',
          goldlight: '#F3E5AB',
          golddark: '#9A7B1C',
          platinum: '#E2E8F0',
          blue: '#1E3A8A',
          cyan: '#38BDF8',
          border: 'rgba(255, 255, 255, 0.08)',
          bordergold: 'rgba(212, 175, 55, 0.25)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-gold': '0 0 25px rgba(212, 175, 55, 0.2)',
        'glow-cyan': '0 0 25px rgba(56, 189, 248, 0.2)',
        'glow-red': '0 0 25px rgba(239, 68, 68, 0.2)'
      }
    },
  },
  plugins: [],
}
