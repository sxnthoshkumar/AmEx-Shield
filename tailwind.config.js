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
          blue: '#0070F3',
          bluedark: '#00388D',
          cyan: '#38BDF8',
          cyanlight: '#E0F2FE',
          platinum: '#E2E8F0',
          border: 'rgba(255, 255, 255, 0.08)',
          borderblue: 'rgba(56, 189, 248, 0.25)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-cyan': '0 0 25px rgba(56, 189, 248, 0.25)',
        'glow-blue': '0 0 25px rgba(0, 112, 243, 0.25)',
        'glow-red': '0 0 25px rgba(239, 68, 68, 0.25)'
      }
    },
  },
  plugins: [],
}
