import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        teacher: {
          primary: {
            DEFAULT: "hsl(211, 100%, 50%)", // #007AFF
            foreground: "hsl(0, 0%, 100%)",
          },
          secondary: {
            DEFAULT: "hsl(145, 63%, 49%)", // #34C759
            foreground: "hsl(0, 0%, 100%)",
          },
          warning: {
            DEFAULT: "hsl(36, 100%, 50%)", // #FF9500
            foreground: "hsl(0, 0%, 100%)",
          },
          danger: {
            DEFAULT: "hsl(9, 100%, 60%)", // #FF3B30
            foreground: "hsl(0, 0%, 100%)",
          },
          background: "hsl(210, 16%, 98%)", // #F8F9FA
          foreground: "hsl(215, 28%, 17%)",
          card: {
            DEFAULT: "hsl(0, 0%, 100%)",
            foreground: "hsl(215, 28%, 17%)",
          },
          border: "hsl(216, 12%, 84%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "12px",
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
        "character-bounce": {
          "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-10px)" },
          "60%": { transform: "translateY(-5px)" },
        },
        "swipe-hint": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(10px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.33)", opacity: "1" },
          "80%, 100%": { transform: "scale(2.33)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "character-bounce": "character-bounce 2s ease-in-out infinite",
        "swipe-hint": "swipe-hint 2s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
      },
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
      perspective: {
        "1000": "1000px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
