/** Convert "#RRGGBB" hex string to numeric 0xRRGGBB */
export function hexToNum(hex: string): number {
  return parseInt(hex.replace("#", ""), 16);
}

/** Convert numeric 0xRRGGBB to "#RRGGBB" hex string */
export function numToHex(num: number): string {
  return "#" + num.toString(16).padStart(6, "0");
}

/** Linearly blend two hex-number colors. ratio=0 → from, ratio=1 → to */
export function blendColor(from: number, to: number, ratio: number): number {
  const t = Math.max(0, Math.min(1, ratio));
  const fr = (from >> 16) & 0xff, fg = (from >> 8) & 0xff, fb = from & 0xff;
  const tr = (to >> 16) & 0xff, tg = (to >> 8) & 0xff, tb = to & 0xff;
  const r = Math.round(fr + (tr - fr) * t);
  const g = Math.round(fg + (tg - fg) * t);
  const b = Math.round(fb + (tb - fb) * t);
  return (r << 16) | (g << 8) | b;
}

/** Darken a color by blending toward black */
export function darkenColor(color: number, amount: number): number {
  return blendColor(color, 0x000000, amount);
}

/** Lighten a color by blending toward white */
export function lightenColor(color: number, amount: number): number {
  return blendColor(color, 0xffffff, amount);
}

/** Parse a CSS hex color string to number. "rainbow" → fallback pink */
export function parseColor(color: string): number {
  if (color === "rainbow") return 0xff6b6b;
  return hexToNum(color);
}
