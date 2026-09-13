/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Roboto'", "sans-serif"],
        mono: ["'Roboto Mono'", "monospace"],
        anton: ["'Anton'", "sans-serif"],
        
      },
      colors: {
        blood: {
          400: "#ff4040",
          500: "#e02020",
          600: "#b00000",
          700: "#800000",
        },
        ember: { 400: "#ff8c00", 500: "#cc6600" },
        spirit: { 400: "#a0c4ff", 500: "#6090dd" },
      },
      animation: {
        "pulse-slow":  "pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite",
        "breathe":     "breathe 4s ease-in-out infinite",
        "blood-pulse": "bloodPulse 1s ease-in-out infinite",
        "rise":        "rise 0.45s ease-out forwards",
        "fade-in":     "fadeIn 0.3s ease-out forwards",
      },
      keyframes: {
        breathe: {
          "0%,100%": { transform: "scale(1)" },
          "50%":     { transform: "scale(1.015)" },
        },
        bloodPulse: {
          "0%,100%": { boxShadow: "0 0 6px #e02020, 0 0 12px #e02020" },
          "50%":     { boxShadow: "0 0 20px #e02020, 0 0 40px #b00000" },
        },
        rise: {
          "0%":   { transform: "translateY(16px)", opacity: 0 },
          "100%": { transform: "translateY(0)",    opacity: 1 },
        },
        fadeIn: {
          "0%":   { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
