import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      // color-mix + <alpha-value> lets opacity modifiers (bg-primary/20 etc.)
      // work on these CSS-variable colours; without it Tailwind silently
      // drops those classes.
      colors: {
        border: "color-mix(in srgb, var(--border) calc(<alpha-value> * 100%), transparent)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "color-mix(in srgb, var(--background) calc(<alpha-value> * 100%), transparent)",
        foreground: "color-mix(in srgb, var(--foreground) calc(<alpha-value> * 100%), transparent)",
        primary: {
          DEFAULT: "color-mix(in srgb, var(--primary) calc(<alpha-value> * 100%), transparent)",
          foreground: "color-mix(in srgb, var(--primary-foreground) calc(<alpha-value> * 100%), transparent)",
          strong: "color-mix(in srgb, var(--primary-strong) calc(<alpha-value> * 100%), transparent)",
          tint: "var(--primary-tint)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "color-mix(in srgb, var(--muted-foreground) calc(<alpha-value> * 100%), transparent)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        "background-alt": "var(--background-alt)",
        "border-strong": "color-mix(in srgb, var(--border-strong) calc(<alpha-value> * 100%), transparent)",
        neon: "var(--neon)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "0.875rem",
        "2xl": "1rem",
        "3xl": "1rem",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        premium: "var(--shadow-md)",
        "premium-lg": "var(--shadow-lg)",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-22px) translateX(8px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 30px -8px color-mix(in oklab, var(--neon) 50%, transparent)" },
          "50%": { boxShadow: "0 0 60px -4px color-mix(in oklab, var(--cyan-glow) 70%, transparent)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        aurora: {
          "0%, 100%": { backgroundPosition: "0% 50%, 100% 50%, 50% 0%" },
          "50%": { backgroundPosition: "100% 50%, 0% 50%, 50% 100%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 8s ease-in-out infinite",
        "float-slow": "float 14s ease-in-out infinite",
        glow: "glow 3s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        aurora: "aurora 18s ease infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
