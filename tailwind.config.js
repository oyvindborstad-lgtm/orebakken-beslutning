/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0F4F4A",
          dark: "#0A3A36",
          light: "#1B6F69",
          50: "#EEF5F4",
        },
        surface: "#F4F5F3",
        ink: "#1A1F1D",
        muted: "#6B7170",
        tax: {
          bg: "#E8F1FA",
          ink: "#1F4E79",
        },
        save: "#2D9A6F",
        warm: "#E89638",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "Segoe UI",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,79,74,0.04), 0 4px 16px rgba(15,79,74,0.06)",
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
