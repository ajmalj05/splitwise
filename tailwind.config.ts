import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          bg: "#FF6B74",        // Main coral/red background
          wallet: "#FF9EB7",    // Soft pink — wallet/form containers
          hand: "#FBD1C5",      // Peach — hand illustration
          coin: "#FFDB9B",      // Light gold — coins & accents
          cardTop: "#FFCE83",   // Card gradient top (light orange)
          cardBottom: "#FF914A",// Card gradient bottom (deep orange)
          cta: "#FF5B6B",       // CTA button (bright coral)
          ctaHover: "#E0404F",  // Hover state for CTA
        },
        // Keep a minimal neutral set for text contrast helpers
        neutral: {
          50: "#FFF5F5",
          100: "#FFE8EA",
          200: "#FFCDD1",
          900: "#1A0608",
        },
      },
      backgroundImage: {
        "card-gradient": "linear-gradient(160deg, #FFCE83 0%, #FF914A 100%)",
        "cta-gradient": "linear-gradient(135deg, #FF7B85 0%, #FF5B6B 100%)",
        "brand-gradient": "linear-gradient(180deg, #FF6B74 0%, #FF4F5A 100%)",
      },
      boxShadow: {
        "float": "0 8px 32px rgba(255, 80, 80, 0.25), 0 2px 8px rgba(0,0,0,0.08)",
        "float-sm": "0 4px 16px rgba(255, 80, 80, 0.2), 0 1px 4px rgba(0,0,0,0.06)",
        "card": "0 12px 40px rgba(220, 50, 50, 0.18), 0 4px 12px rgba(0,0,0,0.08)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        "float": "floatY 3s ease-in-out infinite",
        "float-slow": "floatY 4.5s ease-in-out infinite",
        "float-fast": "floatY 2.5s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "coin-1": "coinFloat1 3.2s ease-in-out infinite",
        "coin-2": "coinFloat2 3.8s ease-in-out infinite 0.8s",
        "coin-3": "coinFloat3 4.1s ease-in-out infinite 1.4s",
        "coin-4": "coinFloat4 3.5s ease-in-out infinite 0.4s",
        "avatar-1": "avatarFloat1 3.6s ease-in-out infinite 0.2s",
        "avatar-2": "avatarFloat2 4.2s ease-in-out infinite 1s",
        "avatar-3": "avatarFloat3 3.9s ease-in-out infinite 1.8s",
        "bounce-soft": "bounceSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floatY: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.8", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        coinFloat1: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "33%": { transform: "translate(-6px, -18px) rotate(15deg)" },
          "66%": { transform: "translate(4px, -32px) rotate(-8deg)" },
        },
        coinFloat2: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "38%": { transform: "translate(8px, -22px) rotate(-12deg)" },
          "72%": { transform: "translate(-3px, -38px) rotate(20deg)" },
        },
        coinFloat3: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "42%": { transform: "translate(-10px, -28px) rotate(25deg)" },
          "78%": { transform: "translate(5px, -44px) rotate(-15deg)" },
        },
        coinFloat4: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "30%": { transform: "translate(12px, -14px) rotate(-20deg)" },
          "65%": { transform: "translate(-4px, -26px) rotate(10deg)" },
        },
        avatarFloat1: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(-4px, -14px)" },
        },
        avatarFloat2: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(6px, -18px)" },
        },
        avatarFloat3: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(-2px, -22px)" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      transitionDuration: {
        250: "250ms",
      },
      borderRadius: {
        "2.5xl": "20px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
