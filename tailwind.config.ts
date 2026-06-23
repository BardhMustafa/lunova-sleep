import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm linen / paper neutrals
        sand: {
          50: "#FBF9F5",
          100: "#F5F1E9",
          200: "#EBE4D6",
          300: "#DBD0BB",
          400: "#C4B597",
        },
        ink: {
          DEFAULT: "#1C1B18",
          soft: "#3A3833",
          muted: "#6B675E",
        },
        // Sage accent (the green mattress piping)
        sage: {
          50: "#F1F4EE",
          100: "#DCE5D4",
          200: "#BACBAA",
          300: "#94AE80",
          400: "#7A975F",
          500: "#5F7A4A",
          600: "#4B6239",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        brand: "0.35em",
      },
      borderRadius: {
        xl2: "1.5rem",
      },
      boxShadow: {
        soft: "0 20px 60px -25px rgba(28, 27, 24, 0.35)",
        lift: "0 30px 80px -30px rgba(28, 27, 24, 0.45)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 1.2s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
