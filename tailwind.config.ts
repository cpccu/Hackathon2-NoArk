import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          navy: {
            50: "#fdf2f2", 100: "#fbe0e1", 200: "#f6bcbe", 300: "#ee8d90", 400: "#e35a5f",
            500: "#e0262c", 600: "#d7141a", 700: "#b30f14", 800: "#8f0c10", 900: "#5c0a0d", 950: "#2b0507",
          },
          gold: {
            50: "#f0fdfa", 100: "#ccfbf1", 200: "#99f6e4", 300: "#5eead4", 400: "#2dd4bf",
            500: "#14b8a6", 600: "#0d9488", 700: "#0f766e", 800: "#115e59", 900: "#134e4a",
          },
        },
      },
      fontFamily: {
        serif: ["var(--font-sans)", "Poppins", "sans-serif"],
        sans: ["var(--font-sans)", "Poppins", "sans-serif"],
        bengali: ["Noto Sans Bengali", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
