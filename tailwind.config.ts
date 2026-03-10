import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        nebula: "radial-gradient(circle at center, var(--nebula-core) 0%, var(--nebula-edge) 100%)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "neon-purple": "rgb(var(--color-neon-purple) / <alpha-value>)",
        "neon-gold": "rgb(var(--color-neon-gold) / <alpha-value>)",
        "neon-amber": "rgb(var(--color-neon-amber) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [],
};

export default config;
