/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        void: "#0A0F1B",
        starlight: "#E2C88C",
        mana: "#8AD4E6",
        arcane: "#9D4EDD",
        parchment: "#151B2E",
      },
      fontFamily: {
        serif: ["CormorantGaramond_400Regular", "serif"],
        sans: ["Inter_400Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
}
