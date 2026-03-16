/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        night: {
          900: "#030617",
          800: "#050826",
          700: "#060b2f"
        },
        moon: "#f5f3e8",
        emerald: {
          500: "#10b981",
          600: "#059669"
        },
        gold: {
          400: "#facc6b",
          500: "#fbbf24",
          600: "#eab308"
        }
      },
      fontFamily: {
        display: ["var(--font-playfair)"],
        arabic: ["var(--font-cairo)"],
        sans: ["var(--font-sans)"]
      },
      boxShadow: {
        "glow-gold":
          "0 0 30px rgba(250, 204, 21, 0.4), 0 0 80px rgba(250, 204, 21, 0.25)",
        "glass-soft": "0 18px 45px rgba(15, 23, 42, 0.45)"
      },
      backgroundImage: {
        "liquid-gold":
          "radial-gradient(circle at 0% 0%, rgba(250, 204, 21,0.35), transparent 55%), radial-gradient(circle at 100% 0%, rgba(34,197,94,0.4), transparent 55%), radial-gradient(circle at 0% 100%, rgba(59,130,246,0.45), transparent 55%), radial-gradient(circle at 100% 100%, rgba(236,72,153,0.45), transparent 55%)",
        "pattern-geo":
          "radial-gradient(circle at 1px 1px, rgba(251,191,36,0.45) 1px, transparent 0)"
      },
      backgroundSize: {
        geo: "36px 36px"
      },
      keyframes: {
        "float-soft": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" }
        },
        twinkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.9)" },
          "50%": { opacity: "1", transform: "scale(1.05)" }
        },
        "lantern-sway": {
          "0%, 100%": { transform: "translateY(0px) rotate(-3deg)" },
          "50%": { transform: "translateY(10px) rotate(3deg)" }
        },
        "firework-burst": {
          "0%": { transform: "scale(0.4)", opacity: "1" },
          "80%": { transform: "scale(1.2)", opacity: "0.9" },
          "100%": { transform: "scale(1.4)", opacity: "0" }
        }
      },
      animation: {
        "float-soft": "float-soft 9s ease-in-out infinite",
        "twinkle-slow": "twinkle 4s ease-in-out infinite",
        "twinkle-fast": "twinkle 2.2s ease-in-out infinite",
        "lantern-sway": "lantern-sway 7s ease-in-out infinite",
        "firework-burst": "firework-burst 1.4s ease-out forwards"
      }
    }
  },
  plugins: []
};

