/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets:[require("nativewind/present")],
  theme: {
    extend: {
      colors: {
        offside: {
          black: "#0D0D0D", // Deep Black Background
          green: "#39FF14", // The "Bet9ja/Offside" Neon
          gray: "#1F1F1F",  // Card Background
          text: "#FFFFFF",  // Primary Text
          muted: "#A1A1A1", // Secondary Text
          red: "#FF3B30",   // Red Card Color
        }
      }
    },
  },
  plugins: [],
}
