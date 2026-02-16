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
        background: "var(--background)",
        foreground: "var(--foreground)",
        gervasio: {
          blue: '#0181ca',
          'blue-dark': '#006ba7',
          'blue-light': '#33a0e0',
        },
        dark: {
          900: '#0a0a0a',
          800: '#121212',
          700: '#1a1a1a',
          600: '#262626',
          500: '#333333',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
