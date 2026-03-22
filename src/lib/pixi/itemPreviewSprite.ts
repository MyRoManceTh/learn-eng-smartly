/**
 * Item Preview Pixel Art Generator
 *
 * Generates 24×24 pixel art previews for shop/inventory items.
 * Each category renders a recognizable miniature of the item.
 * Cached via Map for performance.
 */

import type { AvatarItem } from "@/types/avatar";

const PREVIEW_SIZE = 24;
const cache = new Map<string, string>();

/* shorthand */
function px(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  c: string,
) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}

function darken(hex: string, amt: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const f = 1 - amt;
  return "#" + [
    Math.round(r * f).toString(16).padStart(2, "0"),
    Math.round(g * f).toString(16).padStart(2, "0"),
    Math.round(b * f).toString(16).padStart(2, "0"),
  ].join("");
}

function lighten(hex: string, amt: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return "#" + [
    Math.min(255, Math.round(r + (255 - r) * amt)).toString(16).padStart(2, "0"),
    Math.min(255, Math.round(g + (255 - g) * amt)).toString(16).padStart(2, "0"),
    Math.min(255, Math.round(b + (255 - b) * amt)).toString(16).padStart(2, "0"),
  ].join("");
}

/* ─── Category drawers ────────────────────────── */

function drawSkinPreview(ctx: CanvasRenderingContext2D, color: string) {
  const shade = darken(color, 0.12);
  const blush = "#ffb3b3";
  // Face circle
  px(ctx, 7, 4, 10, 1, color);
  px(ctx, 6, 5, 12, 2, color);
  px(ctx, 5, 7, 14, 8, color);
  px(ctx, 6, 15, 12, 2, color);
  px(ctx, 7, 17, 10, 1, color);
  // Shadow under
  px(ctx, 5, 14, 14, 1, shade);
  // Eyes
  px(ctx, 8, 9, 2, 3, "#ffffff");
  px(ctx, 14, 9, 2, 3, "#ffffff");
  px(ctx, 9, 9, 1, 3, "#23232e");
  px(ctx, 15, 9, 1, 3, "#23232e");
  px(ctx, 8, 9, 1, 1, "#b0d4ff");
  px(ctx, 14, 9, 1, 1, "#b0d4ff");
  // Blush
  px(ctx, 6, 13, 2, 1, blush);
  px(ctx, 16, 13, 2, 1, blush);
  // Mouth
  px(ctx, 11, 14, 2, 1, "#e88b8b");
}

function drawHairPreview(ctx: CanvasRenderingContext2D, path: string, color: string) {
  const hi = lighten(color, 0.25);
  // Small head base
  px(ctx, 8, 10, 8, 6, "#fddcb5");
  // Eyes
  px(ctx, 9, 13, 2, 1, "#23232e");
  px(ctx, 13, 13, 2, 1, "#23232e");

  switch (path) {
    case "softbob":
      px(ctx, 8, 5, 8, 2, color);
      px(ctx, 7, 7, 10, 3, color);
      px(ctx, 7, 10, 2, 4, color);
      px(ctx, 15, 10, 2, 4, color);
      px(ctx, 9, 6, 2, 1, hi);
      break;
    case "silkylong":
      px(ctx, 8, 5, 8, 2, color);
      px(ctx, 7, 7, 10, 3, color);
      px(ctx, 7, 10, 2, 7, color);
      px(ctx, 15, 10, 2, 7, color);
      px(ctx, 9, 6, 3, 1, hi);
      break;
    case "twintails":
      px(ctx, 8, 5, 8, 2, color);
      px(ctx, 7, 7, 10, 3, color);
      px(ctx, 5, 10, 3, 6, color);
      px(ctx, 16, 10, 3, 6, color);
      px(ctx, 6, 11, 1, 1, hi);
      px(ctx, 17, 11, 1, 1, hi);
      break;
    case "wavy":
      px(ctx, 7, 5, 10, 2, color);
      px(ctx, 6, 7, 12, 3, color);
      px(ctx, 5, 10, 3, 4, color);
      px(ctx, 16, 10, 3, 4, color);
      px(ctx, 6, 14, 2, 2, color);
      px(ctx, 16, 14, 2, 2, color);
      px(ctx, 8, 6, 3, 1, hi);
      break;
    case "messy":
      px(ctx, 7, 4, 10, 1, color);
      px(ctx, 7, 5, 10, 2, color);
      px(ctx, 6, 7, 12, 3, color);
      px(ctx, 10, 3, 2, 1, color); // tuft
      px(ctx, 6, 10, 3, 3, color);
      px(ctx, 15, 10, 3, 3, color);
      px(ctx, 9, 5, 2, 1, hi);
      break;
    case "highpony":
      px(ctx, 8, 5, 8, 2, color);
      px(ctx, 7, 7, 10, 3, color);
      px(ctx, 16, 6, 2, 2, color);
      px(ctx, 17, 8, 2, 5, color);
      px(ctx, 9, 6, 2, 1, hi);
      break;
    case "spacebuns":
      px(ctx, 8, 5, 8, 2, color);
      px(ctx, 7, 7, 10, 3, color);
      px(ctx, 5, 3, 4, 3, color);
      px(ctx, 15, 3, 4, 3, color);
      px(ctx, 6, 4, 1, 1, hi);
      px(ctx, 16, 4, 1, 1, hi);
      break;
    case "fluffy":
      px(ctx, 6, 4, 12, 2, color);
      px(ctx, 5, 6, 14, 4, color);
      px(ctx, 5, 10, 3, 3, color);
      px(ctx, 16, 10, 3, 3, color);
      px(ctx, 7, 5, 3, 1, hi);
      px(ctx, 15, 5, 2, 1, hi);
      break;
    case "princess":
      px(ctx, 8, 5, 8, 2, color);
      px(ctx, 7, 7, 10, 3, color);
      px(ctx, 5, 10, 3, 6, color);
      px(ctx, 16, 10, 3, 6, color);
      px(ctx, 4, 16, 3, 2, color);
      px(ctx, 17, 16, 3, 2, color);
      px(ctx, 9, 6, 3, 1, hi);
      break;
    case "electrichawk":
      px(ctx, 9, 2, 6, 1, color);
      px(ctx, 8, 3, 8, 1, color);
      px(ctx, 7, 4, 10, 2, color);
      px(ctx, 6, 6, 12, 4, color);
      px(ctx, 10, 2, 2, 1, hi);
      break;
    default:
      // fallback softbob
      px(ctx, 8, 5, 8, 2, color);
      px(ctx, 7, 7, 10, 3, color);
      px(ctx, 9, 6, 2, 1, hi);
      break;
  }
}

function drawHairColorPreview(ctx: CanvasRenderingContext2D, color: string) {
  if (color === "rainbow") {
    // Rainbow stripes
    const cols = ["#ff6348", "#ffd700", "#2ecc71", "#3498db", "#9b59b6", "#ff69b4"];
    for (let i = 0; i < cols.length; i++) {
      px(ctx, 6, 4 + i * 3, 12, 3, cols[i]);
      px(ctx, 7, 4 + i * 3, 2, 1, lighten(cols[i], 0.3));
    }
    return;
  }
  const hi = lighten(color, 0.25);
  const dk = darken(color, 0.15);
  // Three hair strands
  px(ctx, 4, 3, 4, 16, color);
  px(ctx, 5, 4, 2, 1, hi);
  px(ctx, 4, 18, 3, 1, dk);
  px(ctx, 10, 2, 4, 18, color);
  px(ctx, 11, 3, 2, 1, hi);
  px(ctx, 10, 19, 3, 1, dk);
  px(ctx, 16, 4, 4, 14, color);
  px(ctx, 17, 5, 2, 1, hi);
  px(ctx, 16, 17, 3, 1, dk);
}

function drawHatPreview(ctx: CanvasRenderingContext2D, id: string, color: string) {
  const shadow = darken(color, 0.2);
  const hi = lighten(color, 0.2);

  if (id.includes("beret")) {
    px(ctx, 8, 6, 8, 2, color);
    px(ctx, 6, 8, 12, 3, color);
    px(ctx, 7, 8, 2, 1, hi);
    px(ctx, 5, 11, 14, 2, color);
    px(ctx, 5, 13, 14, 1, shadow);
    px(ctx, 11, 5, 2, 1, shadow);
  } else if (id.includes("bucket")) {
    px(ctx, 8, 5, 8, 2, color);
    px(ctx, 7, 7, 10, 3, color);
    px(ctx, 8, 7, 2, 1, hi);
    px(ctx, 6, 10, 12, 2, color);
    px(ctx, 3, 12, 18, 2, color);
    px(ctx, 3, 14, 18, 1, shadow);
  } else if (id.includes("beanie")) {
    px(ctx, 10, 5, 4, 1, hi);
    px(ctx, 8, 6, 8, 2, color);
    px(ctx, 7, 8, 10, 2, color);
    px(ctx, 6, 10, 12, 2, color);
    px(ctx, 5, 12, 14, 2, shadow);
    for (let c = 5; c <= 18; c += 2) px(ctx, c, 12, 1, 1, hi);
  } else if (id.includes("catears")) {
    px(ctx, 4, 5, 3, 1, color);
    px(ctx, 3, 6, 5, 2, color);
    px(ctx, 4, 7, 3, 1, "#ffb6c1");
    px(ctx, 3, 8, 5, 2, color);
    px(ctx, 17, 5, 3, 1, color);
    px(ctx, 16, 6, 5, 2, color);
    px(ctx, 17, 7, 3, 1, "#ffb6c1");
    px(ctx, 16, 8, 5, 2, color);
    // headband
    px(ctx, 5, 10, 14, 2, darken(color, 0.1));
  } else if (id.includes("bunnyears")) {
    px(ctx, 5, 1, 3, 1, color);
    px(ctx, 4, 2, 5, 7, color);
    px(ctx, 5, 3, 3, 5, "#ffb6c1");
    px(ctx, 16, 1, 3, 1, color);
    px(ctx, 15, 2, 5, 7, color);
    px(ctx, 16, 3, 3, 5, "#ffb6c1");
    px(ctx, 5, 10, 14, 2, darken(color, 0.1));
  } else if (id.includes("flowerband") || id.includes("flower")) {
    px(ctx, 3, 11, 18, 2, "#4caf50");
    px(ctx, 4, 8, 3, 3, "#ff6b9d");
    px(ctx, 5, 9, 1, 1, "#ffeb3b");
    px(ctx, 10, 8, 3, 3, "#42a5f5");
    px(ctx, 11, 9, 1, 1, "#ffeb3b");
    px(ctx, 16, 8, 3, 3, "#ff6b9d");
    px(ctx, 17, 9, 1, 1, "#ffeb3b");
    px(ctx, 8, 10, 1, 1, "#66bb6a");
    px(ctx, 14, 10, 1, 1, "#66bb6a");
  } else if (id.includes("headphones")) {
    px(ctx, 7, 5, 10, 2, color);
    px(ctx, 3, 7, 4, 5, color);
    px(ctx, 4, 8, 2, 3, shadow);
    px(ctx, 17, 7, 4, 5, color);
    px(ctx, 18, 8, 2, 3, shadow);
    px(ctx, 7, 5, 2, 1, hi);
  } else if (id.includes("witch") || id.includes("wizard")) {
    px(ctx, 11, 2, 2, 1, color);
    px(ctx, 10, 3, 4, 1, color);
    px(ctx, 9, 4, 6, 1, color);
    px(ctx, 8, 5, 8, 2, color);
    px(ctx, 7, 7, 10, 2, color);
    px(ctx, 6, 9, 12, 2, color);
    px(ctx, 3, 11, 18, 2, shadow);
    px(ctx, 11, 4, 2, 1, "#ffd700");
    px(ctx, 11, 3, 1, 1, hi);
  } else if (id.includes("tiara")) {
    px(ctx, 7, 9, 10, 2, color);
    px(ctx, 6, 11, 12, 2, shadow);
    px(ctx, 8, 8, 1, 1, color);
    px(ctx, 11, 6, 2, 2, color);
    px(ctx, 15, 8, 1, 1, color);
    px(ctx, 12, 7, 1, 1, "#e040fb");
    px(ctx, 8, 9, 1, 1, "#4fc3f7");
    px(ctx, 15, 9, 1, 1, "#4fc3f7");
  } else if (id.includes("crown")) {
    px(ctx, 6, 6, 1, 1, color);
    px(ctx, 9, 5, 1, 1, color);
    px(ctx, 12, 4, 1, 1, color);
    px(ctx, 14, 5, 1, 1, color);
    px(ctx, 17, 6, 1, 1, color);
    px(ctx, 6, 7, 12, 2, color);
    px(ctx, 7, 7, 2, 1, hi);
    px(ctx, 8, 8, 1, 1, "#e53935");
    px(ctx, 12, 8, 1, 1, "#e53935");
    px(ctx, 15, 8, 1, 1, "#e53935");
    px(ctx, 5, 9, 14, 2, color);
    px(ctx, 5, 11, 14, 1, shadow);
  } else {
    // fallback baseball cap
    px(ctx, 8, 6, 8, 2, color);
    px(ctx, 7, 8, 10, 2, color);
    px(ctx, 5, 10, 14, 2, color);
    px(ctx, 3, 12, 10, 2, shadow);
  }
}

function drawShirtPreview(ctx: CanvasRenderingContext2D, color: string) {
  const dk = darken(color, 0.15);
  const hi = lighten(color, 0.15);
  // T-shirt shape
  px(ctx, 8, 3, 8, 2, color);  // collar
  px(ctx, 9, 3, 6, 1, hi);     // collar highlight
  // Shoulders + sleeves
  px(ctx, 3, 5, 18, 2, color);
  px(ctx, 2, 7, 6, 4, color);  // left sleeve
  px(ctx, 16, 7, 6, 4, color); // right sleeve
  // Body
  px(ctx, 6, 7, 12, 12, color);
  // Shading
  px(ctx, 6, 7, 1, 12, dk);
  px(ctx, 17, 7, 1, 12, dk);
  px(ctx, 6, 18, 12, 1, dk);
  // Collar detail
  px(ctx, 11, 4, 2, 2, "#ffffff");
}

function drawPantsPreview(ctx: CanvasRenderingContext2D, color: string) {
  const dk = darken(color, 0.15);
  // Waistband
  px(ctx, 5, 3, 14, 2, color);
  px(ctx, 5, 3, 14, 1, darken(color, 0.1));
  // Body
  px(ctx, 5, 5, 14, 5, color);
  // Left leg
  px(ctx, 5, 10, 6, 10, color);
  px(ctx, 5, 10, 1, 10, dk);
  // Right leg
  px(ctx, 13, 10, 6, 10, color);
  px(ctx, 13, 10, 1, 10, dk);
  // Hem
  px(ctx, 5, 19, 6, 1, dk);
  px(ctx, 13, 19, 6, 1, dk);
}

function drawShoesPreview(ctx: CanvasRenderingContext2D, color: string) {
  const dk = darken(color, 0.2);
  const hi = lighten(color, 0.2);
  // Left shoe
  px(ctx, 2, 10, 8, 5, color);
  px(ctx, 1, 12, 10, 3, color);
  px(ctx, 2, 11, 3, 1, hi);
  px(ctx, 1, 14, 10, 1, dk);
  // Right shoe
  px(ctx, 14, 10, 8, 5, color);
  px(ctx, 13, 12, 10, 3, color);
  px(ctx, 14, 11, 3, 1, hi);
  px(ctx, 13, 14, 10, 1, dk);
  // Sole
  px(ctx, 1, 15, 10, 1, "#23232e");
  px(ctx, 13, 15, 10, 1, "#23232e");
}

function drawAccessoryPreview(ctx: CanvasRenderingContext2D, id: string, color: string) {
  const dk = darken(color, 0.2);
  const hi = lighten(color, 0.25);

  if (id.includes("glasses")) {
    // Glasses
    px(ctx, 2, 9, 8, 1, color);
    px(ctx, 2, 10, 1, 5, color);
    px(ctx, 9, 10, 1, 5, color);
    px(ctx, 2, 14, 8, 1, color);
    px(ctx, 3, 10, 6, 4, "#88ccff");
    px(ctx, 10, 9, 4, 1, color);
    px(ctx, 14, 9, 8, 1, color);
    px(ctx, 14, 10, 1, 5, color);
    px(ctx, 21, 10, 1, 5, color);
    px(ctx, 14, 14, 8, 1, color);
    px(ctx, 15, 10, 6, 4, "#88ccff");
    px(ctx, 3, 10, 2, 1, "#bbddff");
    px(ctx, 15, 10, 2, 1, "#bbddff");
  } else if (id.includes("bow")) {
    // Ribbon bow
    px(ctx, 4, 8, 6, 2, color);
    px(ctx, 3, 10, 7, 3, color);
    px(ctx, 4, 10, 3, 1, hi);
    px(ctx, 4, 13, 5, 1, dk);
    px(ctx, 10, 9, 4, 4, dk); // knot
    px(ctx, 11, 10, 2, 2, color);
    px(ctx, 14, 8, 6, 2, color);
    px(ctx, 14, 10, 7, 3, color);
    px(ctx, 16, 10, 3, 1, hi);
    px(ctx, 15, 13, 5, 1, dk);
  } else if (id.includes("necklace")) {
    // Heart pendant necklace
    px(ctx, 4, 5, 16, 1, color);
    px(ctx, 5, 6, 14, 1, color);
    px(ctx, 7, 7, 10, 1, color);
    px(ctx, 9, 8, 6, 1, color);
    px(ctx, 6, 6, 2, 1, hi);
    px(ctx, 14, 6, 2, 1, hi);
    // Heart
    px(ctx, 10, 10, 2, 1, "#ff4081");
    px(ctx, 13, 10, 2, 1, "#ff4081");
    px(ctx, 9, 11, 7, 2, "#ff4081");
    px(ctx, 10, 13, 5, 1, "#ff4081");
    px(ctx, 11, 14, 3, 1, "#ff4081");
    px(ctx, 12, 15, 1, 1, "#ff4081");
    px(ctx, 10, 11, 2, 1, "#ff8ab3"); // shine
  } else if (id.includes("teddy")) {
    // Teddy bear
    const fur = color;
    const furDk = dk;
    // Head
    px(ctx, 8, 4, 8, 7, fur);
    // Ears
    px(ctx, 6, 3, 3, 3, fur);
    px(ctx, 7, 4, 1, 1, "#deb88b");
    px(ctx, 15, 3, 3, 3, fur);
    px(ctx, 16, 4, 1, 1, "#deb88b");
    // Face
    px(ctx, 10, 7, 1, 1, "#23232e");
    px(ctx, 13, 7, 1, 1, "#23232e");
    px(ctx, 11, 9, 2, 1, "#23232e");
    // Body
    px(ctx, 9, 11, 6, 7, fur);
    px(ctx, 9, 17, 6, 1, furDk);
    // Arms
    px(ctx, 6, 12, 3, 4, fur);
    px(ctx, 15, 12, 3, 4, fur);
  } else if (id.includes("scarf")) {
    // Fluffy scarf
    px(ctx, 3, 7, 18, 3, color);
    px(ctx, 4, 8, 4, 1, hi);
    px(ctx, 12, 8, 4, 1, hi);
    px(ctx, 3, 10, 18, 1, dk);
    // Hanging part
    px(ctx, 16, 10, 4, 8, color);
    px(ctx, 17, 11, 2, 1, hi);
    px(ctx, 16, 17, 4, 1, dk);
    // Fringe
    px(ctx, 16, 18, 1, 2, color);
    px(ctx, 18, 18, 1, 2, color);
  } else if (id.includes("bag")) {
    // Star bag
    px(ctx, 7, 3, 10, 2, dk); // strap
    px(ctx, 6, 5, 12, 2, color);
    px(ctx, 5, 7, 14, 10, color);
    px(ctx, 6, 8, 2, 1, hi);
    px(ctx, 5, 16, 14, 1, dk);
    // Star decoration
    px(ctx, 11, 10, 2, 1, "#ffd700");
    px(ctx, 10, 11, 4, 2, "#ffd700");
    px(ctx, 11, 13, 2, 1, "#ffd700");
    px(ctx, 11, 11, 2, 1, "#ffecb3"); // shine
  } else if (id.includes("fairy_wings") || id.includes("wings")) {
    // Fairy wings
    const wingHi = lighten(color, 0.35);
    // Left wing
    px(ctx, 3, 5, 3, 1, color);
    px(ctx, 2, 6, 5, 2, color);
    px(ctx, 3, 7, 2, 1, wingHi);
    px(ctx, 1, 8, 7, 3, color);
    px(ctx, 3, 9, 3, 1, wingHi);
    px(ctx, 2, 11, 5, 2, color);
    px(ctx, 3, 13, 3, 1, darken(color, 0.1));
    // Right wing
    px(ctx, 18, 5, 3, 1, color);
    px(ctx, 17, 6, 5, 2, color);
    px(ctx, 19, 7, 2, 1, wingHi);
    px(ctx, 16, 8, 7, 3, color);
    px(ctx, 18, 9, 3, 1, wingHi);
    px(ctx, 17, 11, 5, 2, color);
    px(ctx, 18, 13, 3, 1, darken(color, 0.1));
    // Body dot
    px(ctx, 11, 7, 2, 8, "#23232e");
  } else if (id.includes("wand")) {
    // Magic wand
    px(ctx, 11, 6, 2, 14, "#8b6b4a"); // stick
    px(ctx, 12, 7, 1, 1, "#a88868"); // highlight
    // Star on top
    px(ctx, 11, 2, 2, 1, "#ffd700");
    px(ctx, 9, 3, 6, 1, "#ffd700");
    px(ctx, 10, 4, 4, 1, "#ffd700");
    px(ctx, 11, 5, 2, 1, "#ffd700");
    px(ctx, 11, 3, 2, 1, "#ffecb3"); // shine
    // Sparkles
    px(ctx, 7, 1, 1, 1, "#ffecb3");
    px(ctx, 16, 3, 1, 1, "#ffecb3");
    px(ctx, 8, 5, 1, 1, "#ffecb3");
  } else if (id.includes("halo")) {
    // Star halo
    px(ctx, 4, 8, 1, 1, "#ffd700");
    px(ctx, 7, 6, 2, 2, "#ffd700");
    px(ctx, 8, 7, 1, 1, "#ffecb3");
    px(ctx, 11, 5, 2, 2, "#ffd700");
    px(ctx, 12, 6, 1, 1, "#ffecb3");
    px(ctx, 15, 6, 2, 2, "#ffd700");
    px(ctx, 16, 7, 1, 1, "#ffecb3");
    px(ctx, 19, 8, 1, 1, "#ffd700");
    // Arc
    px(ctx, 5, 9, 14, 1, "#ffd70066");
    // Sparkles
    px(ctx, 6, 5, 1, 1, "#ffecb3");
    px(ctx, 18, 5, 1, 1, "#ffecb3");
    px(ctx, 12, 3, 1, 1, "#ffecb3");
  } else {
    // Fallback — generic sparkle
    px(ctx, 11, 8, 2, 2, color);
    px(ctx, 10, 10, 4, 4, color);
    px(ctx, 11, 14, 2, 2, color);
    px(ctx, 11, 10, 2, 1, hi);
  }
}

/* ─── public API ─────────────────────────────── */

/**
 * Returns a cached data URL (png) for the item's pixel preview.
 * Using data URL instead of canvas ref for stable React rendering.
 */
export function generateItemPreview(item: AvatarItem): string {
  const key = item.id;
  if (cache.has(key)) return cache.get(key)!;

  const canvas = document.createElement("canvas");
  canvas.width = PREVIEW_SIZE;
  canvas.height = PREVIEW_SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

  const color = item.svgProps?.color || "#888888";

  switch (item.category) {
    case "skin":
      drawSkinPreview(ctx, color);
      break;
    case "hair":
      drawHairPreview(ctx, item.svgProps?.path || "softbob", color === "#1A1A2E" ? "#1A1A2E" : "#7B4B2A");
      break;
    case "hairColor":
      drawHairColorPreview(ctx, color);
      break;
    case "hat":
      drawHatPreview(ctx, item.id, color);
      break;
    case "shirt":
      drawShirtPreview(ctx, color);
      break;
    case "pants":
      drawPantsPreview(ctx, color);
      break;
    case "shoes":
      drawShoesPreview(ctx, color);
      break;
    case "necklace":
    case "leftHand":
    case "rightHand":
    case "aura":
      drawAccessoryPreview(ctx, item.id, color);
      break;
  }

  const dataUrl = canvas.toDataURL("image/png");
  cache.set(key, dataUrl);
  return dataUrl;
}

export const PREVIEW_PX = PREVIEW_SIZE;
