/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0F4F4A",
          dark: "#093733",
          deep: "#062523",
          light: "#1B6F69",
          50: "#EEF5F4",
          100: "#D7E7E5",
        },
        surface: "#F5F4F0",
        paper: "#FBFAF7",
        ink: "#13201E",
        muted: "#6B7170",
        line: "#E5E3DC",
        tax: {
          bg: "#E8F1FA",
          ink: "#1F4E79",
          ring: "#BFD8EE",
        },
        save: {
          DEFAULT: "#1F8A60",
          bg: "#E5F2EC",
        },
        warm: {
          DEFAULT: "#D88438",
          deep: "#B76A24",
          bg: "#FBEFE0",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica Neue",
          "sans-serif",
        ],
        display: [
          "Fraunces",
          "ui-serif",
          "Georgia",
          "serif",
        ],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,79,74,0.04), 0 8px 24px rgba(15,79,74,0.06)",
        soft: "0 1px 3px rgba(15,79,74,0.05)",
        ring: "0 0 0 1px rgba(15,79,74,0.08)",
      },
      borderRadius: {
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      backgroundImage: {
        "hero-fade":
          "radial-gradient(900px 420px at 80% -10%, rgba(15,79,74,0.08), transparent 60%), radial-gradient(700px 360px at 0% 0%, rgba(216,132,56,0.07), transparent 60%)",
      },
    },
  },
  plugins: [],
};
