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
          // Dark Theme Identity
          dark: {
            bg: "#0B0B0B",
            surface: "#151515",
            pink: "#F3A6BE",
            softpink: "#F8CBD8",
            text: "#FFFFFF",
            subtext: "#B8B8B8",
            gold: "#D4AF6A",
          },
          // Light Theme Identity
          light: {
            bg: "#FAF8F5",
            surface: "#FFFFFF",
            subsurface: "#F5F0EB",
            pink: "#E99AB4",
            softpink: "#F4C7D3",
            text: "#171717",
            subtext: "#66615D",
            gold: "#C9A45C",
            softgold: "#E3D1A7",
          },
          // Shared Accents
          pink: "#F3A6BE",
          lightpink: "#E99AB4",
          softpink: "#F8CBD8",
          gold: "#D4AF6A",
          lightgold: "#C9A45C",
          softgold: "#E3D1A7",
        },
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
