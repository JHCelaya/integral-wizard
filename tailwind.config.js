/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC", // Slate 50
        surface: "#FFFFFF",
        primary: "#2563EB", // Blue 600
        secondary: "#E2E8F0", // Slate 200
        text: "#0F172A", // Slate 900
        "text-secondary": "#64748B", // Slate 500
        success: "#10B981", // Emerald 500
        error: "#EF4444", // Red 500
        warning: "#F59E0B", // Amber 500
      },
      fontFamily: {
        sans: ["System"],
        bold: ["System"],
      },
    },
  },
  plugins: [],
}
