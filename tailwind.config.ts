import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          900: "#080c14",
          800: "#0d1117",
          700: "#111827",
          600: "#161d2c",
          500: "#1c2535",
        },
        accent: {
          blue: "#2563eb",
          cyan: "#06b6d4",
          green: "#10b981",
          red: "#ef4444",
          amber: "#f59e0b",
          purple: "#8b5cf6",
        },
        border: {
          DEFAULT: "#1e2d45",
          light: "#253550",
        },
      },
      fontFamily: {
        mono: ["'IBM Plex Mono'", "monospace"],
        sans: ["'DM Sans'", "sans-serif"],
        display: ["'Space Grotesk'", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-right": "slideRight 0.3s ease-out",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { transform: "translateY(12px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        slideRight: { from: { transform: "translateX(-12px)", opacity: "0" }, to: { transform: "translateX(0)", opacity: "1" } },
      },
    },
  },
  plugins: [],
};
export default config;
