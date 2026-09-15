/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        shield: {
          field: "#d8dfd2",
          paper: "#efe4cf",
          cream: "#fff8e8",
          ink: "#102c31",
          mineral: "#2b6171",
          verify: "#1f725b",
          iris: "#695b78",
          amber: "#ad712f",
          copper: "#a64c3d",
        },
        night: { 950: "#102c31", 900: "#193a40", 850: "#213f43", 800: "#2d4547", 700: "#56655f" },
        rate: { 400: "#45a283", 500: "#2d8a6d", 600: "#1f725b", 900: "#cfe3d4" },
        mist: { 400: "#69736b", 500: "#788078", 600: "#899186", 700: "#9ba397" },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      borderRadius: { xl: "4px" },
    },
  },
  plugins: [],
};
