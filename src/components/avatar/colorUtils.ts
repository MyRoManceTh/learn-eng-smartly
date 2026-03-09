/**
 * Utility functions for CSS 3D box face shading
 */

/** Parse hex color to RGB */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

/** Clamp a number between 0 and 255 */
function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

/** RGB to hex */
function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Shade a hex color by a percentage (-100 to +100).
 * Positive = lighter, Negative = darker.
 */
export function shade(color: string, percent: number): string {
  if (color === "rainbow") return color;
  const [r, g, b] = hexToRgb(color);
  const factor = percent / 100;
  if (factor > 0) {
    return rgbToHex(
      r + (255 - r) * factor,
      g + (255 - g) * factor,
      b + (255 - b) * factor,
    );
  }
  return rgbToHex(
    r * (1 + factor),
    g * (1 + factor),
    b * (1 + factor),
  );
}

/** Get rainbow gradient CSS */
export function rainbowGradient(direction = "to right"): string {
  return `linear-gradient(${direction}, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)`;
}

/** Face border style */
export const FACE_BORDER = "inset 0 0 0 1px rgba(0,0,0,0.12)";
