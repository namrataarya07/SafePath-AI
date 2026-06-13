/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050816',
        card: '#0B1220',
        cardBorder: '#14213D',
        primaryGlow: '#00E5FF',
        safeGreen: '#00FF88',
        moderateYellow: '#FFC857',
        dangerRed: '#FF3B3B',
        secondaryText: '#B5B5B5',
      }
    },
  },
  plugins: [],
}
