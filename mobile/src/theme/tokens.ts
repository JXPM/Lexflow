/**
 * LexFlow design tokens — ported from the validated web prototype.
 * Style: Apple-like, minimaliste premium, audio-first.
 * Colors are also mirrored in tailwind.config.js for className usage;
 * this file exposes them for inline styles (gradients, SVG, shadows).
 */
export const colors = {
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
  white: "#FFFFFF",
} as const;

export const gradients = {
  primary: ["#0071E3", "#0077ED"] as const,
  accent: ["#BF5AF2", "#0071E3"] as const,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  full: 999,
} as const;

export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 48,
  8: 64,
} as const;

/** Soft, low-opacity elevations (Apple style). Uses the cross-platform `boxShadow` prop (RN 0.85+). */
export const shadows = {
  card: {
    boxShadow: "0px 6px 20px rgba(0,0,0,0.08)",
  },
  glowPrimary: {
    boxShadow: "0px 6px 18px rgba(0,113,227,0.28)",
  },
} as const;
