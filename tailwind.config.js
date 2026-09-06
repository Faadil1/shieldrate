/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          950: "#0a0a0a",
          900: "#111111",
          850: "#0d0d0d",
          800: "#1a1a1a",
          700: "#262626",
        },
        rate: {
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          900: "#14532d",
        },
        mist: {
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#3f3f3f",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
      },
    },
  },
  plugins: [],
};