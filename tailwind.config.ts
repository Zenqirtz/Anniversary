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
        navy: {
          950: "#060a1f",
          900: "#0a0e27",
          800: "#0f1535",
          700: "#141c42",
          600: "#1a2350",
          500: "#212b60",
        },
        neon: {
          pink: "#ff2d75",
          "pink-dim": "#cc2460",
          cyan: "#00f0ff",
          "cyan-dim": "#00bfcc",
          purple: "#b24dff",
          green: "#39ff14",
        },
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "sans-serif"],
        rajdhani: ["var(--font-rajdhani)", "sans-serif"],
        mono: ["var(--font-share-tech-mono)", "monospace"],
        dancing: ["var(--font-dancing)", "cursive"],
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
