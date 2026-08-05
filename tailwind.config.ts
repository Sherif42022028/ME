import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        me: {
          black: "#0d0d0d",
          dark: "#141414",
          card: "#1a1a1a",
          border: "#2a2a2a",
          white: "#ffffff",
          offwhite: "#faf9f6",
          softpink: "#fce7f3",
          pink: "#f472b6",
          pinkdeep: "#db2777",
          gold: "#d4af37",
          gray: {
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
          }
        }
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "Manrope", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
