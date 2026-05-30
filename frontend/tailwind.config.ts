import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-fira)", "Fira Code", "monospace"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        accent: {
          cyan: "#06b6d4",
          purple: "#a855f7",
          pink: "#ec4899",
          green: "#10b981",
        },
        dark: {
          50: "#f8fafc",
          100: "#0f1117",
          200: "#161b27",
          300: "#1e2535",
          400: "#252d3d",
          500: "#2d3748",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease forwards",
        "fade-up": "fadeUp 0.6s ease forwards",
        "slide-in": "slideIn 0.5s ease forwards",
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 3s ease-in-out infinite",
        "gradient": "gradient 8s ease infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
        "spin-slow": "spin 8s linear infinite",
        "border-spin": "borderSpin 3s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeUp: { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideIn: { "0%": { transform: "translateX(-20px)", opacity: "0" }, "100%": { transform: "translateX(0)", opacity: "1" } },
        glow: { from: { boxShadow: "0 0 10px #6366f155" }, to: { boxShadow: "0 0 30px #6366f199, 0 0 60px #6366f133" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        gradient: { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        borderSpin: { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
      },
      backgroundSize: { "200%": "200%" },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
};

export default config;
