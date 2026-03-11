/**
 * Pixel Art Chibi Character - Detailed 8-bit style (32x42 grid)
 *
 * Inspired by detailed pixel art with:
 * - Big expressive eyes with iris, pupil, highlights
 * - Thick 2px outlines for a bold look
 * - Multiple shading levels for depth
 * - Cute chibi proportions (big head, small body)
 */
import { Container, Graphics } from "pixi.js";
import { EquippedItems } from "@/types/avatar";
import { getItemById } from "@/data/avatarItems";
import { parseColor, darkenColor, lightenColor } from "./colorUtils";

export const GRID_W = 32;
export const GRID_H = 42;

type Grid = (number | null)[][];

interface Colors {
  skin: number;
  skinShade: number;
  skinDeep: number;
  hair: number;
  hairHi: number;
  hairDark: number;
  shirt: number;
  shirtShade: number;
  shirtHi: number;
  pants: number;
  pantsShade: number;
  shoes: number;
  shoesShade: number;
  hat: number | null;
  hatShade: number | null;
  acc: number;
  outline: number;
  outlineLight: number;
  eye: number;
  eyeIris: number;
  mouth: number;
  white: number;
  blush: number;
}

function resolveColors(equipped: EquippedItems): Colors {
  const skinItem = getItemById(equipped.skin);
  const hairColorItem = getItemById(equipped.hairColor);
  const shirtItem = getItemById(equipped.shirt);
  const pantsItem = getItemById(equipped.pants);
  const shoesItem = getItemById(equipped.shoes);
  const hatItem = equipped.hat ? getItemById(equipped.hat) : null;
  const accItem = equipped.accessory ? getItemById(equipped.accessory) : null;

  const skin = parseColor(skinItem?.svgProps?.color || "#F5D5C0");
  const hair = parseColor(hairColorItem?.svgProps?.color || "#2C2C2C");
  const shirt = parseColor(shirtItem?.svgProps?.color || "#4DB6AC");
  const pants = parseColor(pantsItem?.svgProps?.color || "#4A90E2");
  const shoes = parseColor(shoesItem?.svgProps?.color || "#F0F0F0");
  const hat = hatItem ? parseColor(hatItem.svgProps?.color || "#E53935") : null;

  return {
    skin,
    skinShade: darkenColor(skin, 0.15),
    skinDeep: darkenColor(skin, 0.28),
    hair,
    hairHi: lightenColor(hair, 0.22),
    hairDark: darkenColor(hair, 0.25),
    shirt,
    shirtShade: darkenColor(shirt, 0.2),
    shirtHi: lightenColor(shirt, 0.15),
    pants,
    pantsShade: darkenColor(pants, 0.2),
    shoes,
    shoesShade: darkenColor(shoes, 0.25),
    hat,
    hatShade: hat ? darkenColor(hat, 0.2) : null,
    acc: accItem ? parseColor(accItem.svgProps?.color || "#80DEEA") : 0x80deea,
    outline: 0x111122,
    outlineLight: 0x2a2a3e,
    eye: 0x111122,
    eyeIris: 0x4a7dbd,
    mouth: 0xc06060,
    white: 0xffffff,
    blush: 0xffb4b4,
  };
}

// ─── Main entry ───
export function drawChibiCharacter(
  container: Container,
  equipped: EquippedItems,
  _canvasH: number,
  walkFrame: number = 0
): void {
  container.removeChildren();

  const c = resolveColors(equipped);
  const grid = createGrid();

  const hairItem = getItemById(equipped.hair);
  const hairStyle = hairItem?.svgProps?.path || "short";
  const hasHat = !!equipped.hat;

  drawAccessoryBack(grid, equipped.accessory, c);
  drawBody(grid, equipped.shirt, c);
  drawArms(grid, c);
  drawLegs(grid, equipped.pants, c, walkFrame);
  drawShoes(grid, equipped.shoes, c, walkFrame);
  drawHead(grid, c);
  if (!hasHat) drawHair(grid, hairStyle, c);
  if (hasHat) drawHatPixels(grid, equipped.hat!, c);
  drawFace(grid, c, equipped.accessory);
  drawAccessoryFront(grid, equipped.accessory, c);
  addThickOutline(grid, c.outline, c.outlineLight);
  drawShadow(grid);

  renderGrid(container, grid);
}

function createGrid(): Grid {
  return Array.from({ length: GRID_H }, () => Array(GRID_W).fill(null));
}

function set(g: Grid, r: number, c: number, color: number) {
  if (r >= 0 && r < GRID_H && c >= 0 && c < GRID_W) g[r][c] = color;
}

function fillRow(g: Grid, row: number, c1: number, c2: number, color: number) {
  for (let c = c1; c <= c2; c++) set(g, row, c, color);
}

function fillRect(g: Grid, r1: number, c1: number, r2: number, c2: number, color: number) {
  for (let r = r1; r <= r2; r++) fillRow(g, r, c1, c2, color);
}

// ─── HEAD (rows 4-17) — bigger, rounder ───
function drawHead(g: Grid, c: Colors) {
  // Very top - rounded
  fillRow(g, 4, 12, 19, c.skin);
  // Slightly wider
  fillRow(g, 5, 10, 21, c.skin);
  // Full width head
  fillRect(g, 6, 8, 14, 23, c.skin);
  // Lower face
  fillRow(g, 15, 9, 22, c.skin);
  // Chin
  fillRow(g, 16, 10, 21, c.skin);
  fillRow(g, 17, 12, 19, c.skin);

  // Right side shading (3 levels)
  for (let r = 6; r <= 14; r++) {
    set(g, r, 23, c.skinShade);
    if (r >= 8 && r <= 13) set(g, r, 22, c.skinShade);
  }
  // Bottom face shadow
  fillRow(g, 15, 20, 22, c.skinShade);
  fillRow(g, 16, 18, 21, c.skinShade);
  
  // Subtle chin shadow
  fillRow(g, 17, 14, 19, c.skinShade);
  
  // Left side highlight
  for (let r = 7; r <= 10; r++) {
    set(g, r, 8, lightenColor(c.skin, 0.08));
  }
}

// ─── FACE — Big expressive eyes with detail ───
function drawFace(g: Grid, c: Colors, accId: string | null) {
  const hasGlasses = accId === "acc_glasses";

  // ── Eyebrows (row 8) ──
  set(g, 8, 10, c.outline); set(g, 8, 11, c.outline); set(g, 8, 12, c.outline);
  set(g, 8, 19, c.outline); set(g, 8, 20, c.outline); set(g, 8, 21, c.outline);

  // ── LEFT EYE (rows 9-12, cols 10-13) — 4x4 with detail ──
  // Top of eye
  set(g, 9, 10, c.eye); set(g, 9, 11, c.eye); set(g, 9, 12, c.eye); set(g, 9, 13, c.eye);
  // Eye body - white sclera + iris + pupil
  set(g, 10, 10, c.eye); set(g, 10, 11, c.white); set(g, 10, 12, c.eyeIris); set(g, 10, 13, c.eye);
  set(g, 11, 10, c.eye); set(g, 11, 11, c.white); set(g, 11, 12, c.eye); set(g, 11, 13, c.eye);
  // Bottom of eye
  set(g, 12, 10, c.eye); set(g, 12, 11, c.eye); set(g, 12, 12, c.eye); set(g, 12, 13, c.eye);
  // Highlight sparkle!
  set(g, 9, 11, c.white);
  set(g, 10, 11, c.white);

  // ── RIGHT EYE (rows 9-12, cols 18-21) — 4x4 with detail ──
  set(g, 9, 18, c.eye); set(g, 9, 19, c.eye); set(g, 9, 20, c.eye); set(g, 9, 21, c.eye);
  set(g, 10, 18, c.eye); set(g, 10, 19, c.white); set(g, 10, 20, c.eyeIris); set(g, 10, 21, c.eye);
  set(g, 11, 18, c.eye); set(g, 11, 19, c.white); set(g, 11, 20, c.eye); set(g, 11, 21, c.eye);
  set(g, 12, 18, c.eye); set(g, 12, 19, c.eye); set(g, 12, 20, c.eye); set(g, 12, 21, c.eye);
  // Highlight sparkle
  set(g, 9, 19, c.white);
  set(g, 10, 19, c.white);

  // ── Blush marks (row 13) — cute rosy cheeks ──
  set(g, 13, 9, c.blush); set(g, 13, 10, c.blush); set(g, 13, 11, c.blush);
  set(g, 13, 20, c.blush); set(g, 13, 21, c.blush); set(g, 13, 22, c.blush);

  // ── Nose hint (row 12-13) ──
  set(g, 12, 15, c.skinShade); set(g, 12, 16, c.skinShade);
  set(g, 13, 15, c.skinDeep);

  // ── Mouth (row 14-15) — cute smile ──
  set(g, 14, 13, c.mouth); set(g, 14, 14, c.mouth);
  set(g, 14, 17, c.mouth); set(g, 14, 18, c.mouth);
  set(g, 15, 14, c.mouth); set(g, 15, 15, c.mouth); set(g, 15, 16, c.mouth); set(g, 15, 17, c.mouth);
  // Mouth highlight (tooth/shine)
  set(g, 15, 15, c.white); set(g, 15, 16, c.white);

  // ── Glasses overlay ──
  if (hasGlasses) {
    // Left lens frame
    fillRow(g, 8, 9, 14, c.acc);
    set(g, 9, 9, c.acc); set(g, 9, 14, c.acc);
    set(g, 10, 9, c.acc); set(g, 10, 14, c.acc);
    set(g, 11, 9, c.acc); set(g, 11, 14, c.acc);
    fillRow(g, 12, 9, 14, c.acc);
    // Bridge
    fillRow(g, 10, 15, 17, c.acc);
    // Right lens frame
    fillRow(g, 8, 17, 22, c.acc);
    set(g, 9, 17, c.acc); set(g, 9, 22, c.acc);
    set(g, 10, 17, c.acc); set(g, 10, 22, c.acc);
    set(g, 11, 17, c.acc); set(g, 11, 22, c.acc);
    fillRow(g, 12, 17, 22, c.acc);
  }
}

// ─── HAIR ───
function drawHair(g: Grid, style: string, c: Colors) {
  switch (style) {
    case "long": drawLongHair(g, c); break;
    case "ponytail": drawPonytailHair(g, c); break;
    case "bun": drawBunHair(g, c); break;
    case "curly": drawCurlyHair(g, c); break;
    case "spike": drawSpikeHair(g, c); break;
    case "afro": drawAfroHair(g, c); break;
    case "mohawk": drawMohawkHair(g, c); break;
    default: drawShortHair(g, c);
  }
}

function drawShortHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi, hairDark: dk } = c;
  // Top rows — rounded shape
  fillRow(g, 0, 12, 19, h);
  fillRow(g, 1, 10, 21, h);
  set(g, 1, 11, hi); set(g, 1, 12, hi);
  fillRow(g, 2, 9, 22, h);
  set(g, 2, 10, hi); set(g, 2, 11, hi);
  fillRow(g, 3, 8, 23, h);
  set(g, 3, 9, hi); set(g, 3, 10, hi);
  fillRow(g, 4, 7, 24, h);
  set(g, 4, 8, hi); set(g, 4, 9, hi);
  fillRow(g, 5, 7, 24, h);
  set(g, 5, 8, hi);
  // Sides going down with taper
  set(g, 6, 6, h); set(g, 6, 7, h); set(g, 6, 24, h); set(g, 6, 25, dk);
  set(g, 7, 6, h); set(g, 7, 7, h); set(g, 7, 24, dk); set(g, 7, 25, dk);
  set(g, 8, 7, h); set(g, 8, 24, dk);
  // Hair shine streak
  set(g, 2, 13, hi); set(g, 3, 13, hi); set(g, 3, 14, hi);
}

function drawLongHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi, hairDark: dk } = c;
  fillRow(g, 0, 12, 19, h);
  fillRow(g, 1, 10, 21, h);
  set(g, 1, 11, hi); set(g, 1, 12, hi);
  fillRow(g, 2, 9, 22, h);
  set(g, 2, 10, hi);
  fillRow(g, 3, 8, 23, h);
  set(g, 3, 9, hi);
  fillRow(g, 4, 7, 24, h);
  fillRow(g, 5, 7, 24, h);
  // Long sides
  for (let r = 6; r <= 10; r++) {
    set(g, r, 5, h); set(g, r, 6, h); set(g, r, 7, h);
    set(g, r, 24, h); set(g, r, 25, h); set(g, r, 26, h);
  }
  for (let r = 11; r <= 17; r++) {
    set(g, r, 5, dk); set(g, r, 6, dk); set(g, r, 7, dk);
    set(g, r, 24, dk); set(g, r, 25, dk); set(g, r, 26, dk);
  }
  set(g, 18, 6, dk); set(g, 18, 7, dk);
  set(g, 18, 25, dk); set(g, 18, 26, dk);
  // Shine
  set(g, 2, 13, hi); set(g, 3, 13, hi);
}

function drawPonytailHair(g: Grid, c: Colors) {
  drawShortHair(g, c);
  const { hair: h, hairHi: hi, hairDark: dk } = c;
  // Ponytail flowing right
  set(g, 3, 25, h); set(g, 3, 26, h);
  set(g, 4, 26, h); set(g, 4, 27, h);
  set(g, 5, 27, h); set(g, 5, 28, h);
  set(g, 6, 27, h); set(g, 6, 28, h);
  set(g, 7, 27, h); set(g, 7, 28, dk);
  set(g, 8, 27, dk); set(g, 8, 28, dk);
  set(g, 9, 28, dk); set(g, 10, 28, dk);
  set(g, 11, 27, dk);
  // Hair tie
  set(g, 4, 25, 0xe91e63); set(g, 5, 26, 0xe91e63);
  // Shine on ponytail
  set(g, 5, 27, hi);
}

function drawBunHair(g: Grid, c: Colors) {
  drawShortHair(g, c);
  const { hair: h, hairHi: hi } = c;
  // Bun on top — rounder
  fillRow(g, -1, 13, 18, h); // won't render but safe
  fillRect(g, 0, 12, 0, 19, h);
  set(g, 0, 13, hi); set(g, 0, 14, hi);
}

function drawCurlyHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi, hairDark: dk } = c;
  fillRow(g, 0, 11, 20, h);
  fillRow(g, 1, 8, 23, h);
  set(g, 1, 9, hi); set(g, 1, 10, hi);
  fillRow(g, 2, 6, 25, h);
  set(g, 2, 7, hi);
  fillRow(g, 3, 5, 26, h);
  fillRow(g, 4, 5, 26, h);
  fillRow(g, 5, 5, 26, h);
  // Curly bumps on sides
  for (let r = 6; r <= 11; r++) {
    set(g, r, 3, r % 2 === 0 ? h : dk);
    set(g, r, 4, h); set(g, r, 5, h); set(g, r, 6, h);
    set(g, r, 25, h); set(g, r, 26, h); set(g, r, 27, h);
    set(g, r, 28, r % 2 === 0 ? h : dk);
  }
  set(g, 12, 5, dk); set(g, 12, 6, dk);
  set(g, 12, 26, dk); set(g, 12, 27, dk);
}

function drawSpikeHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi, hairDark: dk } = c;
  // Tall spikes
  set(g, 0, 9, hi); set(g, 0, 10, h);
  set(g, 0, 15, hi); set(g, 0, 16, h);
  set(g, 0, 21, hi); set(g, 0, 22, h);
  fillRow(g, 1, 8, 23, h);
  set(g, 1, 9, hi); set(g, 1, 15, hi);
  fillRow(g, 2, 8, 23, h);
  fillRow(g, 3, 8, 23, h);
  fillRow(g, 4, 7, 24, h);
  fillRow(g, 5, 7, 24, h);
  set(g, 6, 6, h); set(g, 6, 7, h); set(g, 6, 24, dk); set(g, 6, 25, h);
  set(g, 7, 6, h); set(g, 7, 25, dk);
}

function drawAfroHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi, hairDark: dk } = c;
  fillRow(g, 0, 9, 22, h);
  set(g, 0, 10, hi); set(g, 0, 11, hi);
  fillRow(g, 1, 6, 25, h);
  set(g, 1, 7, hi); set(g, 1, 8, hi);
  fillRow(g, 2, 4, 27, h);
  set(g, 2, 5, hi);
  fillRow(g, 3, 3, 28, h);
  fillRow(g, 4, 3, 28, h);
  fillRow(g, 5, 3, 28, h);
  for (let r = 6; r <= 10; r++) {
    set(g, r, 3, h); set(g, r, 4, h); set(g, r, 5, h);
    set(g, r, 26, h); set(g, r, 27, dk); set(g, r, 28, dk);
  }
  set(g, 11, 4, dk); set(g, 11, 5, dk);
  set(g, 11, 27, dk);
}

function drawMohawkHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi } = c;
  fillRow(g, 0, 13, 18, h);
  set(g, 0, 14, hi); set(g, 0, 15, hi);
  fillRow(g, 1, 12, 19, h);
  set(g, 1, 13, hi);
  fillRow(g, 2, 12, 19, h);
  fillRow(g, 3, 11, 20, h);
  fillRow(g, 4, 11, 20, h);
  fillRow(g, 5, 11, 20, h);
  set(g, 6, 8, c.skinShade); set(g, 6, 23, c.skinShade);
}

// ─── BODY / SHIRT (rows 18-26) — more detailed ───
function drawBody(g: Grid, shirtId: string, c: Colors) {
  // Neck (row 17-18) with detail
  fillRow(g, 18, 13, 18, c.skin);
  set(g, 18, 17, c.skinShade); set(g, 18, 18, c.skinShade);
  fillRow(g, 19, 13, 18, c.skin);
  set(g, 19, 17, c.skinShade);

  // Shoulders (row 20)
  fillRow(g, 20, 9, 22, c.shirt);
  set(g, 20, 10, c.shirtHi); set(g, 20, 11, c.shirtHi);
  // Body
  fillRect(g, 21, 9, 25, 22, c.shirt);
  // Highlight on left shoulder
  set(g, 21, 9, c.shirtHi); set(g, 21, 10, c.shirtHi);
  // Waist (narrower)
  fillRow(g, 26, 10, 21, c.shirt);

  // Right side shading
  for (let r = 20; r <= 25; r++) {
    set(g, r, 21, c.shirtShade); set(g, r, 22, c.shirtShade);
  }
  // Bottom shading
  fillRow(g, 25, 18, 22, c.shirtShade);
  set(g, 26, 20, c.shirtShade); set(g, 26, 21, c.shirtShade);

  applyShirtPattern(g, shirtId, c);
}

function applyShirtPattern(g: Grid, shirtId: string, c: Colors) {
  if (shirtId.includes("striped")) {
    fillRow(g, 22, 10, 20, c.shirtShade);
    fillRow(g, 24, 10, 20, c.shirtShade);
  } else if (shirtId.includes("superhero")) {
    // Star emblem — bigger
    set(g, 22, 15, 0xffd700); set(g, 22, 16, 0xffd700);
    set(g, 23, 14, 0xffd700); set(g, 23, 15, 0xffd700); set(g, 23, 16, 0xffd700); set(g, 23, 17, 0xffd700);
    set(g, 24, 15, 0xffd700); set(g, 24, 16, 0xffd700);
  } else if (shirtId.includes("hoodie")) {
    set(g, 20, 13, c.shirtShade); set(g, 20, 18, c.shirtShade);
    set(g, 21, 14, c.shirtShade); set(g, 21, 17, c.shirtShade);
    // Pocket
    fillRow(g, 24, 12, 19, c.shirtShade);
    fillRow(g, 25, 12, 19, c.shirtShade);
  } else if (shirtId.includes("tuxedo")) {
    fillRect(g, 21, 14, 25, 17, 0xf0f0f0);
    set(g, 21, 11, c.shirtShade); set(g, 21, 12, c.shirtShade);
    set(g, 21, 19, c.shirtShade); set(g, 21, 20, c.shirtShade);
    // Tie
    set(g, 20, 15, 0xd32f2f); set(g, 20, 16, 0xd32f2f);
    set(g, 21, 15, 0xd32f2f); set(g, 21, 16, 0xd32f2f);
    set(g, 22, 15, 0xb71c1c); set(g, 22, 16, 0xb71c1c);
    set(g, 23, 15, 0xb71c1c); set(g, 23, 16, 0xb71c1c);
  } else if (shirtId.includes("dragon")) {
    set(g, 22, 13, lightenColor(c.shirt, 0.2)); set(g, 22, 18, lightenColor(c.shirt, 0.2));
    set(g, 23, 14, lightenColor(c.shirt, 0.15)); set(g, 23, 17, lightenColor(c.shirt, 0.15));
    set(g, 24, 15, 0xffd700); set(g, 24, 16, 0xffd700);
  } else if (shirtId.includes("galaxy")) {
    set(g, 21, 11, 0xffffff); set(g, 22, 18, 0xffffff); set(g, 24, 13, 0xffffff);
    set(g, 23, 20, 0x7c4dff); set(g, 25, 11, 0x7c4dff);
  }
}

// ─── ARMS (rows 21-26) — more defined ───
function drawArms(g: Grid, c: Colors) {
  // Left arm — sleeve
  fillRect(g, 21, 6, 23, 8, c.shirt);
  set(g, 21, 6, c.shirtHi); set(g, 22, 6, c.shirtHi);
  set(g, 23, 8, c.shirtShade);
  // Hand
  fillRect(g, 24, 6, 26, 8, c.skin);
  set(g, 26, 6, c.skinShade); set(g, 26, 7, c.skinShade);
  // Finger detail
  set(g, 27, 7, c.skin); set(g, 27, 8, c.skinShade);

  // Right arm — sleeve (darker side)
  fillRect(g, 21, 23, 23, 25, c.shirtShade);
  // Hand
  fillRect(g, 24, 23, 26, 25, c.skinShade);
  set(g, 24, 23, c.skin); set(g, 25, 23, c.skin);
  set(g, 27, 23, c.skinShade); set(g, 27, 24, c.skinShade);
}

// ─── LEGS / PANTS (rows 27-34) ───
function drawLegs(g: Grid, pantsId: string, c: Colors, walkFrame: number = 0) {
  const isShorts = pantsId.includes("shorts");
  const isSkirt = pantsId.includes("skirt");

  const lOff = walkFrame === 1 ? -2 : walkFrame === 2 ? 2 : 0;
  const rOff = walkFrame === 1 ? 2 : walkFrame === 2 ? -2 : 0;

  if (isSkirt) {
    fillRow(g, 27, 9, 22, c.pants);
    fillRow(g, 28, 8, 23, c.pants);
    fillRow(g, 29, 7, 24, c.pants);
    set(g, 29, 7, c.pantsShade); set(g, 29, 24, c.pantsShade);
    fillRect(g, 30, 10 + lOff, 32, 14 + lOff, c.skin);
    fillRect(g, 30, 17 + rOff, 32, 21 + rOff, c.skin);
    fillRect(g, 33, 10 + lOff, 34, 14 + lOff, c.skin);
    fillRect(g, 33, 17 + rOff, 34, 21 + rOff, c.skin);
  } else {
    // Waist
    fillRow(g, 27, 10, 21, c.pants);
    // Upper legs
    fillRow(g, 28, 10 + lOff, 14 + lOff, c.pants); fillRow(g, 28, 17 + rOff, 21 + rOff, c.pants);
    if (walkFrame === 0) { fillRow(g, 28, 14, 17, c.pantsShade); }
    fillRow(g, 29, 10 + lOff, 14 + lOff, c.pants); fillRow(g, 29, 17 + rOff, 21 + rOff, c.pants);

    if (isShorts) {
      fillRect(g, 30, 10 + lOff, 32, 14 + lOff, c.skin);
      fillRect(g, 30, 17 + rOff, 32, 21 + rOff, c.skin);
      fillRect(g, 33, 10 + lOff, 34, 14 + lOff, c.skin);
      fillRect(g, 33, 17 + rOff, 34, 21 + rOff, c.skin);
    } else {
      fillRect(g, 30, 10 + lOff, 32, 14 + lOff, c.pants);
      fillRect(g, 30, 17 + rOff, 32, 21 + rOff, c.pants);
      // Shade
      set(g, 30, 14 + lOff, c.pantsShade); set(g, 30, 21 + rOff, c.pantsShade);
      set(g, 31, 14 + lOff, c.pantsShade); set(g, 31, 21 + rOff, c.pantsShade);
      // Lower legs
      fillRect(g, 33, 10 + lOff, 34, 14 + lOff, c.pantsShade);
      fillRect(g, 33, 17 + rOff, 34, 21 + rOff, c.pantsShade);
    }
  }
}

// ─── SHOES (rows 35-37) ───
function drawShoes(g: Grid, shoesId: string, c: Colors, walkFrame: number = 0) {
  const isRocket = shoesId.includes("rocket");
  const isBoots = shoesId.includes("boots") && !isRocket;
  const isHeels = shoesId.includes("heels");
  const isCloud = shoesId.includes("cloud");

  const lOff = walkFrame === 1 ? -2 : walkFrame === 2 ? 2 : 0;
  const rOff = walkFrame === 1 ? 2 : walkFrame === 2 ? -2 : 0;

  // Left shoe
  fillRect(g, 35, 8 + lOff, 36, 15 + lOff, c.shoes);
  fillRow(g, 37, 8 + lOff, 15 + lOff, c.shoesShade);
  // Shoe highlight
  set(g, 35, 9 + lOff, lightenColor(c.shoes, 0.15));
  // Right shoe
  fillRect(g, 35, 16 + rOff, 36, 23 + rOff, c.shoes);
  fillRow(g, 37, 16 + rOff, 23 + rOff, c.shoesShade);
  set(g, 35, 17 + rOff, lightenColor(c.shoes, 0.15));

  if (isRocket) {
    fillRow(g, 38, 10 + lOff, 13 + lOff, 0xff6d00);
    fillRow(g, 38, 18 + rOff, 21 + rOff, 0xff6d00);
    set(g, 38, 11 + lOff, 0xffab00); set(g, 38, 19 + rOff, 0xffab00);
  } else if (isBoots) {
    fillRect(g, 33, 8 + lOff, 34, 15 + lOff, c.shoes);
    fillRect(g, 33, 16 + rOff, 34, 23 + rOff, c.shoes);
  } else if (isHeels) {
    set(g, 38, 8 + lOff, c.shoesShade); set(g, 38, 9 + lOff, c.shoesShade);
    set(g, 38, 16 + rOff, c.shoesShade); set(g, 38, 17 + rOff, c.shoesShade);
  } else if (isCloud) {
    fillRow(g, 38, 8 + lOff, 14 + lOff, 0xe3f2fd);
    set(g, 38, 10 + lOff, 0xbbdefb); set(g, 38, 12 + lOff, 0xbbdefb);
    fillRow(g, 38, 16 + rOff, 22 + rOff, 0xe3f2fd);
    set(g, 38, 18 + rOff, 0xbbdefb); set(g, 38, 20 + rOff, 0xbbdefb);
  }
}

// ─── HATS ───
function drawHatPixels(g: Grid, hatId: string, c: Colors) {
  const h = c.hat!;
  const sh = c.hatShade!;

  if (hatId.includes("baseball")) {
    fillRow(g, 0, 10, 21, h);
    fillRow(g, 1, 9, 22, h); set(g, 1, 10, lightenColor(h, 0.15)); set(g, 1, 11, lightenColor(h, 0.15));
    fillRow(g, 2, 8, 23, h);
    fillRow(g, 3, 8, 23, h);
    fillRow(g, 4, 7, 24, h);
    // Brim
    fillRow(g, 5, 5, 24, sh);
    fillRow(g, 6, 4, 24, sh);
  } else if (hatId.includes("beanie")) {
    set(g, 0, 15, lightenColor(h, 0.3)); set(g, 0, 16, lightenColor(h, 0.3));
    fillRow(g, 1, 10, 21, h); set(g, 1, 11, lightenColor(h, 0.15));
    fillRow(g, 2, 9, 22, h);
    fillRow(g, 3, 8, 23, h);
    fillRow(g, 4, 8, 23, h);
    fillRow(g, 5, 8, 23, sh);
  } else if (hatId.includes("crown")) {
    set(g, 0, 9, h); set(g, 0, 10, h);
    set(g, 0, 15, h); set(g, 0, 16, h);
    set(g, 0, 21, h); set(g, 0, 22, h);
    fillRow(g, 1, 9, 22, h);
    set(g, 1, 12, 0xe53935); set(g, 1, 13, 0xe53935);
    set(g, 1, 18, 0x2196f3); set(g, 1, 19, 0x2196f3);
    fillRow(g, 2, 9, 22, h);
    fillRow(g, 3, 9, 22, h);
    fillRow(g, 4, 9, 22, sh);
  } else if (hatId.includes("wizard")) {
    set(g, 0, 15, h); set(g, 0, 16, h);
    fillRow(g, 1, 12, 19, h);
    set(g, 1, 15, 0xffd700); set(g, 1, 16, 0xffd700);
    fillRow(g, 2, 10, 21, h);
    fillRow(g, 3, 8, 23, h);
    fillRow(g, 4, 7, 24, h);
    fillRow(g, 5, 5, 26, sh);
    fillRow(g, 6, 4, 27, sh);
  } else if (hatId.includes("santa")) {
    fillRow(g, 0, 18, 24, h);
    set(g, 0, 24, 0xf5f5f5); set(g, 0, 25, 0xf5f5f5);
    fillRow(g, 1, 10, 22, h);
    fillRow(g, 2, 9, 23, h);
    fillRow(g, 3, 8, 23, h);
    fillRow(g, 4, 8, 23, h);
    fillRow(g, 5, 8, 23, 0xf5f5f5);
    fillRow(g, 6, 8, 23, 0xf5f5f5);
  } else if (hatId.includes("headphones")) {
    fillRow(g, 2, 10, 21, h);
    fillRow(g, 3, 10, 21, h);
    fillRect(g, 7, 4, 9, 7, h);
    fillRect(g, 10, 4, 11, 7, sh);
    fillRect(g, 7, 24, 9, 27, h);
    fillRect(g, 10, 24, 11, 27, sh);
  } else if (hatId.includes("halo")) {
    fillRow(g, 0, 9, 22, 0xffd700);
    fillRow(g, 1, 9, 22, 0xffd700);
    set(g, 0, 9, 0xffecb3); set(g, 0, 22, 0xffecb3);
    set(g, 1, 9, 0xffecb3); set(g, 1, 22, 0xffecb3);
  } else if (hatId.includes("devil")) {
    set(g, 0, 6, h); set(g, 0, 7, h); set(g, 1, 7, sh); set(g, 1, 8, sh);
    set(g, 0, 24, h); set(g, 0, 25, h); set(g, 1, 23, sh); set(g, 1, 24, sh);
  } else if (hatId.includes("astronaut")) {
    fillRow(g, 1, 8, 23, 0xe0e0e0);
    fillRect(g, 2, 6, 5, 25, 0xe0e0e0);
    fillRect(g, 7, 9, 11, 22, 0x42a5f5);
    set(g, 7, 10, 0x90caf9); set(g, 7, 11, 0x90caf9);
    set(g, 8, 10, 0x90caf9);
  }
}

// ─── ACCESSORIES (back) ───
function drawAccessoryBack(g: Grid, accId: string | null, c: Colors) {
  if (!accId) return;
  if (accId.includes("cape")) {
    fillRect(g, 21, 3, 23, 5, c.acc);
    fillRect(g, 24, 2, 27, 5, c.acc);
    set(g, 27, 3, darkenColor(c.acc, 0.2));
    fillRect(g, 21, 26, 23, 28, c.acc);
    fillRect(g, 24, 26, 27, 29, c.acc);
    set(g, 27, 28, darkenColor(c.acc, 0.2));
  } else if (accId.includes("wings")) {
    fillRect(g, 20, 2, 22, 5, c.acc);
    set(g, 20, 2, lightenColor(c.acc, 0.2)); set(g, 20, 3, lightenColor(c.acc, 0.2));
    fillRect(g, 20, 26, 22, 29, c.acc);
    set(g, 20, 28, lightenColor(c.acc, 0.2)); set(g, 20, 29, lightenColor(c.acc, 0.2));
  } else if (accId.includes("backpack")) {
    fillRect(g, 20, 25, 25, 28, c.acc);
    set(g, 24, 26, darkenColor(c.acc, 0.15)); set(g, 24, 27, darkenColor(c.acc, 0.15));
    set(g, 25, 25, darkenColor(c.acc, 0.2)); set(g, 25, 28, darkenColor(c.acc, 0.2));
  } else if (accId.includes("shield")) {
    fillRect(g, 21, 2, 25, 5, c.acc);
    set(g, 21, 3, lightenColor(c.acc, 0.2)); set(g, 21, 4, lightenColor(c.acc, 0.2));
    set(g, 25, 3, darkenColor(c.acc, 0.2)); set(g, 25, 4, darkenColor(c.acc, 0.2));
    set(g, 26, 3, darkenColor(c.acc, 0.2)); set(g, 26, 4, darkenColor(c.acc, 0.2));
  }
}

// ─── ACCESSORIES (front) ───
function drawAccessoryFront(g: Grid, accId: string | null, c: Colors) {
  if (!accId) return;
  if (accId.includes("sword")) {
    for (let r = 14; r <= 20; r++) set(g, r, 27, 0xc0c0c0);
    set(g, 21, 27, 0x8d6e63); set(g, 22, 27, 0x8d6e63);
    set(g, 20, 26, 0xffd700); set(g, 20, 28, 0xffd700);
    set(g, 23, 27, 0x5d4037);
  } else if (accId.includes("pet_cat")) {
    fillRect(g, 35, 26, 37, 29, c.acc);
    set(g, 34, 26, c.acc); set(g, 34, 29, c.acc);
    set(g, 35, 27, c.eye); set(g, 35, 28, c.eye);
    set(g, 37, 30, c.acc); set(g, 38, 30, darkenColor(c.acc, 0.2));
  } else if (accId.includes("pet_dog")) {
    fillRect(g, 35, 26, 37, 29, c.acc);
    set(g, 34, 25, darkenColor(c.acc, 0.2)); set(g, 34, 30, darkenColor(c.acc, 0.2));
    set(g, 35, 27, c.eye); set(g, 35, 28, c.eye);
    set(g, 37, 30, c.acc); set(g, 38, 31, c.acc);
  }
}

// ─── SHADOW ───
function drawShadow(g: Grid) {
  fillRow(g, 39, 9, 22, -1);
  fillRow(g, 40, 10, 21, -1);
  fillRow(g, 41, 11, 20, -1);
}

// ─── THICK AUTO-OUTLINE (2px for bold pixel look) ───
function addThickOutline(g: Grid, outlineColor: number, outlineLightColor: number) {
  const snap = g.map(r => [...r]);
  // Primary outline (4-directional neighbors)
  const dirs4: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  // Secondary outline (diagonal neighbors for 2px thickness feel)
  const dirs8: [number, number][] = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

  // Pass 1: main outline
  for (let r = 0; r < GRID_H; r++) {
    for (let c = 0; c < GRID_W; c++) {
      if (snap[r][c] !== null && snap[r][c] !== -1) {
        for (const [dr, dc] of dirs4) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < GRID_H && nc >= 0 && nc < GRID_W && snap[nr][nc] === null) {
            g[nr][nc] = outlineColor;
          }
        }
      }
    }
  }

  // Pass 2: secondary outline on diagonals for thickness
  const snap2 = g.map(r => [...r]);
  for (let r = 0; r < GRID_H; r++) {
    for (let c = 0; c < GRID_W; c++) {
      if (snap[r][c] !== null && snap[r][c] !== -1) {
        for (const [dr, dc] of dirs8) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < GRID_H && nc >= 0 && nc < GRID_W && snap2[nr][nc] === null) {
            g[nr][nc] = outlineLightColor;
          }
        }
      }
    }
  }
}

// ─── RENDER GRID → PIXI ───
function renderGrid(container: Container, grid: Grid) {
  const g = new Graphics();

  for (let r = 0; r < GRID_H; r++) {
    for (let c = 0; c < GRID_W; c++) {
      const color = grid[r][c];
      if (color === -1) {
        g.rect(c, r, 1, 1).fill({ color: 0x000000, alpha: 0.18 });
      } else if (color !== null) {
        g.rect(c, r, 1, 1).fill(color);
      }
    }
  }

  container.addChild(g);
}
