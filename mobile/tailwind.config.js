/** @type {import('tailwindcss').Config} */
// Design tokens ported 1:1 from the LexFlow web prototype (tokens.json / styles.css).
// Apple-like, audio-first, minimaliste premium.
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#F5F5F7",
        surface: "#FFFFFF",
        surface2: "#F5F5F7",
        primary: "#0071E3",
        secondary: "#0077ED",
        accent: "#BF5AF2",
        error: "#FF3B30",
        success: "#34C759",
        text: "#1D1D1F",
        muted: "#6E6E73",
        border: "rgba(0,0,0,0.08)",
        borderStrong: "rgba(0,0,0,0.14)",
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        full: "999px",
      },
      fontSize: {
        h1: ["34px", { lineHeight: "36px", letterSpacing: "-0.7px" }],
        h2: ["26px", { lineHeight: "30px", letterSpacing: "-0.5px" }],
        h3: ["20px", { lineHeight: "25px", letterSpacing: "-0.2px" }],
        body: ["16px", { lineHeight: "25px" }],
        caption: ["14px", { lineHeight: "20px" }],
        eyebrow: ["12px", { lineHeight: "16px", letterSpacing: "1.6px" }],
      },
    },
  },
  plugins: [],
};
