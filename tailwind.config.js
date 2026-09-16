/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#080B11",
          900: "#0D111A",
          850: "#121824",
          800: "#182030",
          750: "#1E293E",
          700: "#273550",
          600: "#384B70",
        },
        stellar: {
          50: "#EEF6FF",
          100: "#D9EBFF",
          200: "#BAD9FF",
          300: "#8AC0FF",
          400: "#529DFE",
          500: "#0066FF",
          600: "#0052D4",
          700: "#003FA8",
          800: "#003282",
          900: "#052763",
          accent: "#00E5FF",
        },
        charcoal: {
          900: "#12141A",
          800: "#1A1D26",
          700: "#282C38",
        },
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(0, 102, 255, 0.25)',
        'glow-md': '0 0 25px -4px rgba(0, 102, 255, 0.35)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
