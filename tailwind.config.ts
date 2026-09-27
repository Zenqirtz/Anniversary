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
        "float-particle": "floatParticle 8s ease-in-out infinite",
        "sparkle-float": "sparkleFloat 5s ease-in-out infinite",
        "orb-breathe": "orbBreathe 30s ease-in-out infinite",
        "rise-particle": "riseParticle var(--duration, 12s) linear infinite",
        "success-pulse": "successPulse 1s ease-in-out infinite",
        "success-ring": "successRing 2s linear infinite",
        "photo-float": "photoFloat 4s ease-in-out infinite",
        "lock-bob": "lockBob 3s ease-in-out infinite",
        "title-glow": "titleGlow 3s ease-in-out infinite",
        "status-blink": "statusBlink 2s ease-in-out infinite",
        "hint-pulse": "hintPulse 2s ease-in-out infinite",
        "decrypting": "decrypting 0.5s ease-in-out infinite",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
        floatParticle: {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.05" },
          "50%": { transform: "translateY(-30px)", opacity: "0.25" },
        },
        sparkleFloat: {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.2" },
          "50%": { transform: "translateY(-15px)", opacity: "0.7" },
        },
        orbBreathe: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.4" },
          "50%": { transform: "translate(30px, 20px) scale(1.15)", opacity: "0.7" },
        },
        riseParticle: {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "0.7" },
          "90%": { opacity: "0.7" },
          "100%": { transform: "translateY(-120vh) rotate(360deg)", opacity: "0" },
        },
        successPulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
        successRing: {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "100%": { transform: "scale(1) rotate(360deg)" },
        },
        photoFloat: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        lockBob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        titleGlow: {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "1" },
        },
        statusBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        hintPulse: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.9" },
        },
        decrypting: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
