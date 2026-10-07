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
            50: "#f0f4f9",
            100: "#d9e2ee",
            200: "#b3c5dd",
            300: "#80a1c6",
            400: "#4f7dae",
            500: "#2d5f94",
            600: "#1f4773",
            700: "#163455",
            800: "#0f243b",
            900: "#0b1928",
            950: "#060d16",
          },
          gold: {
            50: "#fbf8ef",
            100: "#f5edd6",
            200: "#ebdaa9",
            300: "#dec077",
            400: "#d2a74c",
            500: "#c39031",
            600: "#aa7427",
            700: "#865422",
            800: "#6d4321",
            900: "#5a371e",
          },
        },
      },
      fontFamily: {
        serif: ["Merriweather", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        bengali: ["Noto Sans Bengali", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
