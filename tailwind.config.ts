import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F4F1FF",
          100: "#EBE5FF",
          200: "#D7CCFF",
          300: "#B8A4FF",
          400: "#9474FB",
          500: "#7350F2",
          600: "#6139E3",
          700: "#4F2BC2",
          800: "#3E239A",
          900: "#2C1A6E",
        },
        ink: "#17133A",
        body: "#5B5F7B",
        line: "#E7E8F1",
        canvas: "#F7F7FB",
        success: "#16A36A",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,19,58,0.04), 0 8px 24px -12px rgba(23,19,58,0.12)",
        lift: "0 2px 4px rgba(23,19,58,0.05), 0 18px 40px -16px rgba(97,57,227,0.35)",
      },
      keyframes: {
        "pop-in": {
          "0%": { transform: "scale(0.7)", opacity: "0" },
          "60%": { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-up": {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "pop-in": "pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
