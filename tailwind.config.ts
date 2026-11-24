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
        primary: {
          DEFAULT: "#087C59",
          hover: "#066347",
          light: "#E7F4EF",
          surface: "#F2F9F6",
          dark: "#044431",
        },
        accent: {
          DEFAULT: "#FFA51F",
          hover: "#E68F13",
          light: "#FFF4E3",
          border: "#FFE2B3",
        },
        cream: {
          DEFAULT: "#FFF9F0",
          50: "#FFFDF9",
          100: "#FFF9F0",
          200: "#FCEFD9",
        },
        neutral: {
          dark: "#34433D",
          secondary: "#64736B",
          muted: "#9AA5A0",
          border: "#E2E8E5",
          light: "#F7FAF8",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 8px -1px rgba(52, 67, 61, 0.06), 0 1px 3px -1px rgba(52, 67, 61, 0.04)",
        hover: "0 10px 24px -3px rgba(8, 124, 89, 0.12), 0 4px 8px -2px rgba(8, 124, 89, 0.06)",
        dropdown: "0 12px 32px rgba(52, 67, 61, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
