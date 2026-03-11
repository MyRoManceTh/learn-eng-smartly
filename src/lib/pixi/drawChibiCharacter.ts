/**
 * HD-2D Pixel Art Character — Octopath Traveler inspired
 * 48×64 grid with multi-level shading, dithering, rim-lighting
 *
 * Features:
 * - 5-level shading (highlight → base → shade → deep → ambient)
 * - Dither patterns for smooth gradients
 * - Large expressive eyes with iris detail + double highlights
 * - Sub-surface scattering on skin edges
 * - Clothing fold shadows
 * - Anti-aliased thick outline
 */
import { Container, Graphics } from "pixi.js";
import { EquippedItems } from "@/types/avatar";
import { getItemById } from "@/data/avatarItems";
import { parseColor, darkenColor, lightenColor, blendColor } from "./colorUtils";

export const GRID_W = 48;
export const GRID_H = 64;

type Grid = (number | null)[][];

interface Colors {
  skin: number;
  skinHi: number;
  skinShade: number;
  skinDeep: number;
  skinRim: number;   // warm rim light (SSS)
  hair: number;
  hairHi: number;
  hairMid: number;
  hairDark: number;
  hairDeep: number;
  shirt: number;
  shirtHi: number;
  shirtMid: number;
  shirtShade: number;
  shirtDeep: number;
  pants: number;
  pantsHi: number;
  pantsShade: number;
  pantsDeep: number;
  shoes: number;
  shoesHi: number;
  shoesShade: number;
  hat: number | null;
  hatHi: number | null;
  hatShade: number | null;
  acc: number;
  outline: number;
  outlineSoft: number;
  eye: number;
  eyeIris: number;
  eyeIrisHi: number;
  eyeIrisDeep: number;
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
  const iris = 0x4a7dbd;

  return {
    skin,
    skinHi: lightenColor(skin, 0.12),
    skinShade: darkenColor(skin, 0.12),
    skinDeep: darkenColor(skin, 0.25),
    skinRim: blendColor(skin, 0xffccaa, 0.35),
    hair,
    hairHi: lightenColor(hair, 0.28),
    hairMid: lightenColor(hair, 0.12),
    hairDark: darkenColor(hair, 0.18),
    hairDeep: darkenColor(hair, 0.35),
    shirt,
    shirtHi: lightenColor(shirt, 0.2),
    shirtMid: lightenColor(shirt, 0.08),
    shirtShade: darkenColor(shirt, 0.15),
    shirtDeep: darkenColor(shirt, 0.3),
    pants,
    pantsHi: lightenColor(pants, 0.15),
    pantsShade: darkenColor(pants, 0.15),
    pantsDeep: darkenColor(pants, 0.3),
    shoes,
    shoesHi: lightenColor(shoes, 0.15),
    shoesShade: darkenColor(shoes, 0.25),
    hat,
    hatHi: hat ? lightenColor(hat, 0.2) : null,
    hatShade: hat ? darkenColor(hat, 0.2) : null,
    acc: accItem ? parseColor(accItem.svgProps?.color || "#80DEEA") : 0x80deea,
    outline: 0x0d0d1a,
    outlineSoft: 0x1e1e30,
    eye: 0x0d0d1a,
    eyeIris: iris,
    eyeIrisHi: lightenColor(iris, 0.3),
    eyeIrisDeep: darkenColor(iris, 0.3),
    mouth: 0xc06060,
    white: 0xffffff,
    blush: 0xffb0b0,
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
  addHDOutline(grid, c.outline, c.outlineSoft);
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

/** Dither: checkerboard blend of two colors */
function dither(g: Grid, r: number, c: number, col1: number, col2: number) {
  set(g, r, c, (r + c) % 2 === 0 ? col1 : col2);
}

function ditherRow(g: Grid, row: number, c1: number, c2: number, col1: number, col2: number) {
  for (let c = c1; c <= c2; c++) dither(g, row, c, col1, col2);
}

function fillEllipse(g: Grid, cy: number, cx: number, ry: number, rx: number, color: number) {
  for (let r = cy - ry; r <= cy + ry; r++) {
    for (let c = cx - rx; c <= cx + rx; c++) {
      const dx = (c - cx) / rx;
      const dy = (r - cy) / ry;
      if (dx * dx + dy * dy <= 1.0) set(g, r, c, color);
    }
  }
}

// ─── HEAD (rows 6-27) — large chibi head ───
function drawHead(g: Grid, c: Colors) {
  // Build a big round head using ellipse
  fillEllipse(g, 16, 23, 11, 12, c.skin);

  // Top highlight (light hitting from top-left)
  fillEllipse(g, 12, 20, 4, 6, c.skinHi);

  // Right side shading
  for (let r = 8; r <= 25; r++) {
    const d = Math.abs(r - 16);
    const edgeC = 35 - Math.floor(d * d * 0.08);
    for (let col = edgeC; col <= 35; col++) {
      if (g[r] && g[r][col] === c.skin) {
        g[r][col] = c.skinShade;
      }
    }
  }

  // Bottom chin shading
  for (let r = 23; r <= 27; r++) {
    for (let col = 12; col <= 34; col++) {
      if (g[r] && g[r][col] === c.skin) {
        dither(g, r, col, c.skinShade, c.skinDeep);
      }
    }
  }

  // Warm rim light on left edge (sub-surface scattering)
  for (let r = 10; r <= 22; r++) {
    for (let col = 11; col <= 12; col++) {
      if (g[r] && g[r][col] !== null) {
        set(g, r, col, c.skinRim);
      }
    }
  }

  // Neck (rows 26-29)
  fillRect(g, 26, 19, 29, 27, c.skin);
  fillRect(g, 26, 25, 29, 27, c.skinShade);
  ditherRow(g, 28, 19, 24, c.skin, c.skinShade);
}

// ─── FACE — HD-2D detailed eyes ───
function drawFace(g: Grid, c: Colors, accId: string | null) {
  const hasGlasses = accId === "acc_glasses";

  // ── Eyebrows (row 12-13) — expressive thick brows ──
  fillRow(g, 12, 14, 18, c.outline);
  fillRow(g, 12, 28, 32, c.outline);
  set(g, 13, 14, c.outline);
  set(g, 13, 32, c.outline);

  // ── LEFT EYE (rows 14-20, cols 13-20) — 8x7 HD eye ──
  // Top lid (thick)
  fillRow(g, 14, 14, 19, c.eye);
  fillRow(g, 15, 13, 20, c.eye);
  // Sclera
  fillRect(g, 16, 13, 19, 20, c.white);
  // Iris (gradient: light top → dark bottom)
  fillRect(g, 16, 16, 17, 19, c.eyeIrisHi);
  fillRect(g, 18, 16, 19, 19, c.eyeIris);
  // Pupil
  set(g, 17, 17, c.eye); set(g, 17, 18, c.eye);
  set(g, 18, 17, c.eye); set(g, 18, 18, c.eye);
  // Deep iris shadow
  set(g, 19, 16, c.eyeIrisDeep); set(g, 19, 17, c.eyeIrisDeep);
  set(g, 19, 18, c.eyeIrisDeep); set(g, 19, 19, c.eyeIrisDeep);
  // Highlight sparkles! (big + small)
  set(g, 16, 15, c.white); set(g, 16, 16, c.white); // big highlight
  set(g, 17, 15, c.white);
  set(g, 19, 19, c.white); // small bottom highlight
  // Bottom lid
  fillRow(g, 20, 14, 19, c.eye);
  // Eyelash detail
  set(g, 14, 13, c.eye); set(g, 14, 20, c.eye);

  // ── RIGHT EYE (rows 14-20, cols 26-33) — mirror ──
  fillRow(g, 14, 27, 32, c.eye);
  fillRow(g, 15, 26, 33, c.eye);
  fillRect(g, 16, 26, 19, 33, c.white);
  fillRect(g, 16, 27, 17, 30, c.eyeIrisHi);
  fillRect(g, 18, 27, 19, 30, c.eyeIris);
  set(g, 17, 28, c.eye); set(g, 17, 29, c.eye);
  set(g, 18, 28, c.eye); set(g, 18, 29, c.eye);
  set(g, 19, 27, c.eyeIrisDeep); set(g, 19, 28, c.eyeIrisDeep);
  set(g, 19, 29, c.eyeIrisDeep); set(g, 19, 30, c.eyeIrisDeep);
  set(g, 16, 30, c.white); set(g, 16, 31, c.white);
  set(g, 17, 31, c.white);
  set(g, 19, 27, c.white);
  fillRow(g, 20, 27, 32, c.eye);
  set(g, 14, 26, c.eye); set(g, 14, 33, c.eye);

  // ── Blush (rows 20-21) — soft pink ovals ──
  fillRow(g, 20, 12, 14, c.blush);
  fillRow(g, 21, 12, 15, c.blush);
  fillRow(g, 20, 32, 34, c.blush);
  fillRow(g, 21, 31, 34, c.blush);

  // ── Nose hint ──
  set(g, 20, 23, c.skinShade);
  set(g, 21, 23, c.skinDeep);
  set(g, 21, 24, c.skinShade);

  // ── Mouth — cute smile with highlight ──
  set(g, 23, 20, c.mouth); set(g, 23, 21, c.mouth);
  fillRow(g, 23, 25, 26, c.mouth);
  fillRow(g, 24, 21, 25, c.mouth);
  // Teeth/shine
  set(g, 24, 22, c.white); set(g, 24, 23, c.white); set(g, 24, 24, c.white);

  // ── Glasses overlay ──
  if (hasGlasses) {
    // Left lens frame
    fillRow(g, 14, 11, 21, c.acc);
    set(g, 15, 11, c.acc); set(g, 15, 21, c.acc);
    set(g, 16, 11, c.acc); set(g, 16, 21, c.acc);
    set(g, 17, 11, c.acc); set(g, 17, 21, c.acc);
    set(g, 18, 11, c.acc); set(g, 18, 21, c.acc);
    fillRow(g, 19, 11, 21, c.acc);
    // Bridge
    fillRow(g, 16, 22, 24, c.acc);
    // Right lens frame
    fillRow(g, 14, 25, 35, c.acc);
    set(g, 15, 25, c.acc); set(g, 15, 35, c.acc);
    set(g, 16, 25, c.acc); set(g, 16, 35, c.acc);
    set(g, 17, 25, c.acc); set(g, 17, 35, c.acc);
    set(g, 18, 25, c.acc); set(g, 18, 35, c.acc);
    fillRow(g, 19, 25, 35, c.acc);
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
  const { hair: h, hairHi: hi, hairMid: mid, hairDark: dk, hairDeep: dp } = c;
  // Crown
  fillRow(g, 2, 17, 29, h);
  fillRow(g, 3, 14, 32, h);
  ditherRow(g, 3, 15, 17, hi, h);
  fillRow(g, 4, 12, 34, h);
  set(g, 4, 13, hi); set(g, 4, 14, hi); set(g, 4, 15, hi);
  fillRow(g, 5, 10, 36, h);
  set(g, 5, 11, hi); set(g, 5, 12, hi);
  fillRect(g, 6, 9, 8, 37, h);
  // Hair shine streak (HD-2D style highlight band)
  fillRow(g, 4, 18, 22, hi);
  ditherRow(g, 5, 17, 23, hi, mid);
  fillRow(g, 6, 19, 21, hi);
  // Sides going down
  for (let r = 9; r <= 13; r++) {
    set(g, r, 8, h); set(g, r, 9, h); set(g, r, 10, h);
    set(g, r, 36, dk); set(g, r, 37, dk);
  }
  // Taper
  set(g, 14, 9, dk); set(g, 14, 10, dk);
  set(g, 14, 37, dp);
  // Dither transition on right side
  for (let r = 10; r <= 13; r++) {
    dither(g, r, 35, h, dk);
  }
}

function drawLongHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi, hairMid: mid, hairDark: dk, hairDeep: dp } = c;
  // Crown (same as short)
  fillRow(g, 2, 17, 29, h);
  fillRow(g, 3, 14, 32, h);
  fillRow(g, 4, 12, 34, h);
  set(g, 4, 13, hi); set(g, 4, 14, hi);
  fillRow(g, 5, 10, 36, h);
  set(g, 5, 11, hi);
  fillRect(g, 6, 9, 8, 37, h);
  // Shine
  fillRow(g, 4, 18, 22, hi);
  ditherRow(g, 5, 17, 23, hi, mid);
  // Long flowing sides
  for (let r = 9; r <= 18; r++) {
    set(g, r, 6, h); set(g, r, 7, h); set(g, r, 8, h); set(g, r, 9, h); set(g, r, 10, h);
    set(g, r, 36, h); set(g, r, 37, h); set(g, r, 38, h); set(g, r, 39, dk);
  }
  for (let r = 19; r <= 28; r++) {
    set(g, r, 6, dk); set(g, r, 7, dk); set(g, r, 8, dk); set(g, r, 9, dk);
    set(g, r, 37, dk); set(g, r, 38, dp); set(g, r, 39, dp);
    dither(g, r, 10, h, dk);
  }
  // Tapered ends
  set(g, 29, 7, dp); set(g, 29, 8, dp); set(g, 29, 9, dp);
  set(g, 29, 38, dp); set(g, 29, 39, dp);
  // Strand highlights
  for (let r = 12; r <= 22; r += 3) {
    set(g, r, 7, mid); set(g, r, 37, mid);
  }
}

function drawPonytailHair(g: Grid, c: Colors) {
  drawShortHair(g, c);
  const { hair: h, hairHi: hi, hairDark: dk, hairDeep: dp } = c;
  // Ponytail flowing right
  fillRect(g, 5, 37, 6, 39, h);
  set(g, 7, 38, h); set(g, 7, 39, h); set(g, 7, 40, h);
  set(g, 8, 39, h); set(g, 8, 40, h); set(g, 8, 41, h);
  for (let r = 9; r <= 14; r++) {
    set(g, r, 40, h); set(g, r, 41, dk);
  }
  set(g, 15, 41, dp); set(g, 16, 40, dp);
  // Hair tie
  set(g, 6, 37, 0xe91e63); set(g, 6, 38, 0xe91e63);
  set(g, 7, 37, 0xe91e63);
  // Shine on ponytail
  set(g, 9, 40, hi); set(g, 10, 40, hi);
}

function drawBunHair(g: Grid, c: Colors) {
  drawShortHair(g, c);
  const { hair: h, hairHi: hi } = c;
  // Bun on top
  fillEllipse(g, 1, 23, 2, 4, h);
  set(g, 0, 22, hi); set(g, 0, 23, hi);
}

function drawCurlyHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi, hairDark: dk, hairDeep: dp } = c;
  fillRow(g, 1, 15, 31, h);
  fillRow(g, 2, 11, 35, h);
  set(g, 2, 12, hi);
  fillRow(g, 3, 8, 38, h);
  fillRect(g, 4, 6, 8, 40, h);
  // Curly bumps on sides
  for (let r = 9; r <= 18; r++) {
    const bump = r % 3 === 0 ? 2 : 0;
    set(g, r, 4 - bump, h); set(g, r, 5 - bump, h); set(g, r, 6, h); set(g, r, 7, h); set(g, r, 8, h);
    set(g, r, 38, h); set(g, r, 39, h); set(g, r, 40, dk); set(g, r, 41 + bump, dk);
  }
  set(g, 19, 7, dp); set(g, 19, 8, dp);
  set(g, 19, 39, dp); set(g, 19, 40, dp);
  // Shine
  fillRow(g, 4, 18, 22, hi);
  ditherRow(g, 5, 17, 23, hi, h);
}

function drawSpikeHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi, hairDark: dk } = c;
  // Tall spikes
  set(g, 0, 12, hi); set(g, 0, 13, h);
  set(g, 0, 22, hi); set(g, 0, 23, h);
  set(g, 0, 32, hi); set(g, 0, 33, h);
  fillRow(g, 1, 11, 35, h);
  set(g, 1, 12, hi); set(g, 1, 22, hi);
  fillRow(g, 2, 11, 35, h);
  fillRow(g, 3, 11, 35, h);
  fillRect(g, 4, 10, 8, 36, h);
  set(g, 9, 9, h); set(g, 9, 10, h); set(g, 9, 36, dk); set(g, 9, 37, h);
  set(g, 10, 9, h); set(g, 10, 37, dk);
}

function drawAfroHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi, hairDark: dk, hairDeep: dp } = c;
  fillRow(g, 0, 13, 33, h);
  set(g, 0, 14, hi); set(g, 0, 15, hi);
  fillRow(g, 1, 9, 37, h);
  set(g, 1, 10, hi);
  fillRow(g, 2, 6, 40, h);
  fillRect(g, 3, 4, 5, 42, h);
  fillRect(g, 6, 4, 8, 42, h);
  for (let r = 9; r <= 16; r++) {
    set(g, r, 4, h); set(g, r, 5, h); set(g, r, 6, h); set(g, r, 7, h);
    set(g, r, 39, dk); set(g, r, 40, dk); set(g, r, 41, dp);
  }
  set(g, 17, 6, dp); set(g, 17, 7, dp);
  set(g, 17, 40, dp);
  // Shine
  fillRow(g, 3, 15, 20, hi);
}

function drawMohawkHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi } = c;
  fillRow(g, 0, 19, 27, h);
  set(g, 0, 20, hi); set(g, 0, 21, hi);
  fillRow(g, 1, 18, 28, h);
  set(g, 1, 19, hi);
  fillRow(g, 2, 18, 28, h);
  fillRow(g, 3, 17, 29, h);
  fillRow(g, 4, 17, 29, h);
  fillRow(g, 5, 16, 30, h);
  fillRect(g, 6, 16, 8, 30, h);
}

// ─── BODY / SHIRT (rows 29-40) ───
function drawBody(g: Grid, shirtId: string, c: Colors) {
  // Neck area already drawn by drawHead

  // Collar / shoulders (row 30)
  fillRow(g, 30, 12, 34, c.shirt);
  set(g, 30, 13, c.shirtHi); set(g, 30, 14, c.shirtHi); set(g, 30, 15, c.shirtHi);

  // Torso with HD shading
  fillRect(g, 31, 12, 38, 34, c.shirt);

  // Left side highlight (light source top-left)
  for (let r = 31; r <= 35; r++) {
    set(g, r, 12, c.shirtHi); set(g, r, 13, c.shirtHi);
    dither(g, r, 14, c.shirtHi, c.shirt);
  }

  // Right side shadow
  for (let r = 31; r <= 38; r++) {
    set(g, r, 33, c.shirtShade); set(g, r, 34, c.shirtShade);
    dither(g, r, 32, c.shirt, c.shirtShade);
  }

  // Bottom fold shadow
  ditherRow(g, 37, 14, 32, c.shirt, c.shirtShade);
  fillRow(g, 38, 14, 33, c.shirtShade);
  // Deep shadow under arms
  set(g, 32, 12, c.shirtDeep); set(g, 32, 34, c.shirtDeep);

  // Waist (narrower)
  fillRow(g, 39, 14, 32, c.shirtShade);

  applyShirtPattern(g, shirtId, c);
}

function applyShirtPattern(g: Grid, shirtId: string, c: Colors) {
  if (shirtId.includes("striped")) {
    ditherRow(g, 33, 14, 32, c.shirtShade, c.shirt);
    ditherRow(g, 36, 14, 32, c.shirtShade, c.shirt);
  } else if (shirtId.includes("superhero")) {
    // Star emblem
    set(g, 33, 22, 0xffd700); set(g, 33, 23, 0xffd700); set(g, 33, 24, 0xffd700);
    set(g, 34, 21, 0xffd700); set(g, 34, 22, 0xffd700); set(g, 34, 23, 0xffd700); set(g, 34, 24, 0xffd700); set(g, 34, 25, 0xffd700);
    set(g, 35, 22, 0xffd700); set(g, 35, 23, 0xffd700); set(g, 35, 24, 0xffd700);
  } else if (shirtId.includes("hoodie")) {
    set(g, 30, 19, c.shirtShade); set(g, 30, 27, c.shirtShade);
    set(g, 31, 20, c.shirtShade); set(g, 31, 26, c.shirtShade);
    // Pocket
    fillRect(g, 36, 17, 38, 29, c.shirtShade);
  } else if (shirtId.includes("tuxedo")) {
    fillRect(g, 31, 20, 37, 26, 0xf0f0f0);
    set(g, 31, 16, c.shirtShade); set(g, 31, 17, c.shirtShade);
    set(g, 31, 29, c.shirtShade); set(g, 31, 30, c.shirtShade);
    // Tie
    set(g, 30, 22, 0xd32f2f); set(g, 30, 23, 0xd32f2f); set(g, 30, 24, 0xd32f2f);
    set(g, 31, 22, 0xd32f2f); set(g, 31, 23, 0xd32f2f); set(g, 31, 24, 0xd32f2f);
    set(g, 32, 23, 0xb71c1c); set(g, 33, 23, 0xb71c1c);
    set(g, 34, 23, 0xb71c1c); set(g, 35, 23, 0xb71c1c);
  } else if (shirtId.includes("dragon")) {
    set(g, 33, 19, lightenColor(c.shirt, 0.2)); set(g, 33, 27, lightenColor(c.shirt, 0.2));
    set(g, 34, 21, lightenColor(c.shirt, 0.15)); set(g, 34, 25, lightenColor(c.shirt, 0.15));
    set(g, 35, 22, 0xffd700); set(g, 35, 23, 0xffd700); set(g, 35, 24, 0xffd700);
  } else if (shirtId.includes("galaxy")) {
    set(g, 32, 15, 0xffffff); set(g, 34, 28, 0xffffff); set(g, 36, 19, 0xffffff);
    set(g, 33, 30, 0x7c4dff); set(g, 37, 15, 0x7c4dff);
  }
}

// ─── ARMS (rows 31-40) ───
function drawArms(g: Grid, c: Colors) {
  // Left arm — sleeve with gradient
  fillRect(g, 31, 7, 34, 11, c.shirt);
  set(g, 31, 7, c.shirtHi); set(g, 31, 8, c.shirtHi);
  set(g, 32, 7, c.shirtHi);
  set(g, 34, 11, c.shirtShade);
  dither(g, 33, 11, c.shirt, c.shirtShade);
  // Forearm skin
  fillRect(g, 35, 7, 38, 11, c.skin);
  set(g, 37, 7, c.skinHi);
  set(g, 38, 11, c.skinShade);
  // Hand with finger detail
  fillRect(g, 39, 7, 41, 11, c.skin);
  set(g, 39, 7, c.skinHi);
  set(g, 40, 7, c.skinShade); set(g, 40, 8, c.skinShade);
  set(g, 41, 8, c.skinShade); set(g, 41, 9, c.skin);
  // Finger lines
  set(g, 41, 10, c.skinShade);

  // Right arm — sleeve (darker side)
  fillRect(g, 31, 35, 34, 39, c.shirtShade);
  set(g, 31, 35, c.shirt);
  dither(g, 32, 35, c.shirt, c.shirtShade);
  // Forearm
  fillRect(g, 35, 35, 38, 39, c.skinShade);
  set(g, 35, 35, c.skin); set(g, 36, 35, c.skin);
  // Hand
  fillRect(g, 39, 35, 41, 39, c.skinShade);
  set(g, 39, 35, c.skin); set(g, 39, 36, c.skin);
  set(g, 41, 36, c.skinDeep); set(g, 41, 37, c.skinShade);
}

// ─── LEGS / PANTS (rows 40-51) ───
function drawLegs(g: Grid, pantsId: string, c: Colors, walkFrame: number = 0) {
  const isShorts = pantsId.includes("shorts");
  const isSkirt = pantsId.includes("skirt");

  const lOff = walkFrame === 1 ? -3 : walkFrame === 2 ? 3 : 0;
  const rOff = walkFrame === 1 ? 3 : walkFrame === 2 ? -3 : 0;

  if (isSkirt) {
    fillRow(g, 40, 12, 34, c.pants);
    fillRow(g, 41, 10, 36, c.pants);
    fillRow(g, 42, 9, 37, c.pants);
    set(g, 42, 9, c.pantsShade); set(g, 42, 37, c.pantsShade);
    ditherRow(g, 42, 34, 37, c.pants, c.pantsShade);
    // Legs below skirt
    fillRect(g, 43, 14 + lOff, 50, 20 + lOff, c.skin);
    fillRect(g, 43, 26 + rOff, 50, 32 + rOff, c.skin);
    // Leg shading
    for (let r = 43; r <= 50; r++) {
      set(g, r, 20 + lOff, c.skinShade);
      set(g, r, 32 + rOff, c.skinShade);
    }
  } else {
    // Waist band
    fillRow(g, 40, 14, 32, c.pants);
    ditherRow(g, 40, 14, 32, c.pantsHi, c.pants);

    // Left leg
    fillRect(g, 41, 14 + lOff, 47, 20 + lOff, c.pants);
    // Right leg
    fillRect(g, 41, 26 + rOff, 47, 32 + rOff, c.pants);

    if (walkFrame === 0) {
      // Crotch shadow
      ditherRow(g, 41, 20, 26, c.pantsShade, c.pantsDeep);
    }

    // Shading on legs
    for (let r = 41; r <= 47; r++) {
      set(g, r, 20 + lOff, c.pantsShade);
      set(g, r, 32 + rOff, c.pantsShade);
      dither(g, r, 19 + lOff, c.pants, c.pantsShade);
      dither(g, r, 31 + rOff, c.pants, c.pantsShade);
    }

    if (isShorts) {
      // Exposed legs below shorts
      fillRect(g, 45, 14 + lOff, 50, 20 + lOff, c.skin);
      fillRect(g, 45, 26 + rOff, 50, 32 + rOff, c.skin);
      for (let r = 45; r <= 50; r++) {
        set(g, r, 20 + lOff, c.skinShade);
        set(g, r, 32 + rOff, c.skinShade);
      }
    } else {
      // Lower legs
      fillRect(g, 48, 14 + lOff, 50, 20 + lOff, c.pantsShade);
      fillRect(g, 48, 26 + rOff, 50, 32 + rOff, c.pantsShade);
      // Dither transition
      ditherRow(g, 48, 14 + lOff, 20 + lOff, c.pants, c.pantsShade);
      ditherRow(g, 48, 26 + rOff, 32 + rOff, c.pants, c.pantsShade);
    }
  }
}

// ─── SHOES (rows 51-55) ───
function drawShoes(g: Grid, shoesId: string, c: Colors, walkFrame: number = 0) {
  const isRocket = shoesId.includes("rocket");
  const isBoots = shoesId.includes("boots") && !isRocket;
  const isHeels = shoesId.includes("heels");
  const isCloud = shoesId.includes("cloud");

  const lOff = walkFrame === 1 ? -3 : walkFrame === 2 ? 3 : 0;
  const rOff = walkFrame === 1 ? 3 : walkFrame === 2 ? -3 : 0;

  // Left shoe
  fillRect(g, 51, 12 + lOff, 53, 22 + lOff, c.shoes);
  fillRow(g, 54, 12 + lOff, 22 + lOff, c.shoesShade);
  set(g, 51, 13 + lOff, c.shoesHi); set(g, 51, 14 + lOff, c.shoesHi);
  dither(g, 52, 13 + lOff, c.shoesHi, c.shoes);

  // Right shoe
  fillRect(g, 51, 24 + rOff, 53, 34 + rOff, c.shoes);
  fillRow(g, 54, 24 + rOff, 34 + rOff, c.shoesShade);
  set(g, 51, 25 + rOff, c.shoesHi); set(g, 51, 26 + rOff, c.shoesHi);
  dither(g, 52, 25 + rOff, c.shoesHi, c.shoes);

  if (isRocket) {
    fillRow(g, 55, 14 + lOff, 19 + lOff, 0xff6d00);
    fillRow(g, 55, 27 + rOff, 32 + rOff, 0xff6d00);
    set(g, 55, 16 + lOff, 0xffab00); set(g, 55, 29 + rOff, 0xffab00);
  } else if (isBoots) {
    fillRect(g, 48, 12 + lOff, 50, 22 + lOff, c.shoes);
    fillRect(g, 48, 24 + rOff, 50, 34 + rOff, c.shoes);
  } else if (isHeels) {
    set(g, 55, 12 + lOff, c.shoesShade); set(g, 55, 13 + lOff, c.shoesShade);
    set(g, 55, 24 + rOff, c.shoesShade); set(g, 55, 25 + rOff, c.shoesShade);
  } else if (isCloud) {
    fillRow(g, 55, 12 + lOff, 20 + lOff, 0xe3f2fd);
    set(g, 55, 14 + lOff, 0xbbdefb); set(g, 55, 17 + lOff, 0xbbdefb);
    fillRow(g, 55, 24 + rOff, 32 + rOff, 0xe3f2fd);
    set(g, 55, 26 + rOff, 0xbbdefb); set(g, 55, 29 + rOff, 0xbbdefb);
  }
}

// ─── HATS ───
function drawHatPixels(g: Grid, hatId: string, c: Colors) {
  const h = c.hat!;
  const hi = c.hatHi!;
  const sh = c.hatShade!;

  if (hatId.includes("baseball")) {
    fillRow(g, 1, 14, 32, h);
    fillRow(g, 2, 12, 34, h); set(g, 2, 13, hi); set(g, 2, 14, hi);
    fillRow(g, 3, 11, 35, h);
    fillRow(g, 4, 10, 36, h);
    fillRow(g, 5, 10, 36, h);
    // Brim
    fillRow(g, 6, 7, 36, sh);
    fillRow(g, 7, 5, 36, sh);
    fillRow(g, 8, 5, 36, sh);
  } else if (hatId.includes("beanie")) {
    set(g, 0, 22, lightenColor(h, 0.3)); set(g, 0, 23, lightenColor(h, 0.3)); set(g, 0, 24, lightenColor(h, 0.3));
    fillRow(g, 1, 14, 32, h); set(g, 1, 15, hi);
    fillRow(g, 2, 12, 34, h);
    fillRow(g, 3, 11, 35, h);
    fillRow(g, 4, 11, 35, h);
    fillRow(g, 5, 11, 35, h);
    fillRow(g, 6, 11, 35, sh);
    fillRow(g, 7, 11, 35, sh);
  } else if (hatId.includes("crown")) {
    set(g, 0, 13, h); set(g, 0, 14, h);
    set(g, 0, 22, h); set(g, 0, 23, h);
    set(g, 0, 31, h); set(g, 0, 32, h);
    fillRow(g, 1, 13, 33, h);
    set(g, 1, 17, 0xe53935); set(g, 1, 18, 0xe53935);
    set(g, 1, 28, 0x2196f3); set(g, 1, 29, 0x2196f3);
    fillRow(g, 2, 13, 33, h);
    fillRow(g, 3, 13, 33, h);
    fillRow(g, 4, 13, 33, h);
    fillRow(g, 5, 13, 33, sh);
    fillRow(g, 6, 13, 33, sh);
  } else if (hatId.includes("wizard")) {
    set(g, 0, 22, h); set(g, 0, 23, h);
    fillRow(g, 1, 18, 28, h);
    set(g, 1, 22, 0xffd700); set(g, 1, 23, 0xffd700);
    fillRow(g, 2, 14, 32, h);
    fillRow(g, 3, 11, 35, h);
    fillRow(g, 4, 10, 36, h);
    fillRow(g, 5, 7, 39, sh);
    fillRow(g, 6, 5, 41, sh);
    fillRow(g, 7, 5, 41, sh);
  } else if (hatId.includes("santa")) {
    fillRow(g, 0, 28, 36, h);
    set(g, 0, 36, 0xf5f5f5); set(g, 0, 37, 0xf5f5f5); set(g, 0, 38, 0xf5f5f5);
    fillRow(g, 1, 14, 34, h);
    fillRow(g, 2, 12, 35, h);
    fillRow(g, 3, 11, 35, h);
    fillRow(g, 4, 11, 35, h);
    fillRow(g, 5, 11, 35, h);
    fillRow(g, 6, 11, 35, 0xf5f5f5);
    fillRow(g, 7, 11, 35, 0xf5f5f5);
  } else if (hatId.includes("headphones")) {
    fillRow(g, 3, 14, 32, h);
    fillRow(g, 4, 14, 32, h);
    fillRect(g, 10, 5, 15, 10, h);
    fillRect(g, 16, 5, 17, 10, sh);
    fillRect(g, 10, 36, 15, 41, h);
    fillRect(g, 16, 36, 17, 41, sh);
  } else if (hatId.includes("halo")) {
    fillRow(g, 0, 13, 33, 0xffd700);
    fillRow(g, 1, 13, 33, 0xffd700);
    set(g, 0, 13, 0xffecb3); set(g, 0, 33, 0xffecb3);
    set(g, 1, 13, 0xffecb3); set(g, 1, 33, 0xffecb3);
  } else if (hatId.includes("devil")) {
    set(g, 0, 8, h); set(g, 0, 9, h); set(g, 1, 9, sh); set(g, 1, 10, sh); set(g, 1, 11, sh);
    set(g, 0, 37, h); set(g, 0, 38, h); set(g, 1, 35, sh); set(g, 1, 36, sh); set(g, 1, 37, sh);
  } else if (hatId.includes("astronaut")) {
    fillRow(g, 1, 11, 35, 0xe0e0e0);
    fillRect(g, 2, 8, 7, 38, 0xe0e0e0);
    fillRect(g, 10, 13, 17, 33, 0x42a5f5);
    set(g, 10, 14, 0x90caf9); set(g, 10, 15, 0x90caf9); set(g, 10, 16, 0x90caf9);
    set(g, 11, 14, 0x90caf9);
  }
}

// ─── ACCESSORIES (back) ───
function drawAccessoryBack(g: Grid, accId: string | null, c: Colors) {
  if (!accId) return;
  if (accId.includes("cape")) {
    fillRect(g, 31, 3, 35, 7, c.acc);
    fillRect(g, 36, 2, 40, 7, c.acc);
    set(g, 40, 3, darkenColor(c.acc, 0.2)); set(g, 40, 4, darkenColor(c.acc, 0.2));
    fillRect(g, 31, 39, 35, 43, c.acc);
    fillRect(g, 36, 39, 40, 44, c.acc);
    set(g, 40, 43, darkenColor(c.acc, 0.2)); set(g, 40, 44, darkenColor(c.acc, 0.2));
  } else if (accId.includes("wings")) {
    fillRect(g, 30, 2, 33, 7, c.acc);
    set(g, 30, 2, lightenColor(c.acc, 0.2)); set(g, 30, 3, lightenColor(c.acc, 0.2));
    fillRect(g, 30, 39, 33, 44, c.acc);
    set(g, 30, 43, lightenColor(c.acc, 0.2)); set(g, 30, 44, lightenColor(c.acc, 0.2));
  } else if (accId.includes("backpack")) {
    fillRect(g, 30, 38, 38, 43, c.acc);
    set(g, 36, 39, darkenColor(c.acc, 0.15)); set(g, 36, 40, darkenColor(c.acc, 0.15));
    set(g, 38, 38, darkenColor(c.acc, 0.2)); set(g, 38, 43, darkenColor(c.acc, 0.2));
  } else if (accId.includes("shield")) {
    fillRect(g, 31, 2, 38, 7, c.acc);
    set(g, 31, 3, lightenColor(c.acc, 0.2)); set(g, 31, 4, lightenColor(c.acc, 0.2));
    set(g, 38, 3, darkenColor(c.acc, 0.2)); set(g, 38, 4, darkenColor(c.acc, 0.2));
  }
}

// ─── ACCESSORIES (front) ───
function drawAccessoryFront(g: Grid, accId: string | null, c: Colors) {
  if (!accId) return;
  if (accId.includes("sword")) {
    for (let r = 20; r <= 30; r++) set(g, r, 41, 0xc0c0c0);
    set(g, 31, 41, 0x8d6e63); set(g, 32, 41, 0x8d6e63);
    set(g, 30, 40, 0xffd700); set(g, 30, 42, 0xffd700);
    set(g, 33, 41, 0x5d4037);
    // Blade shine
    set(g, 22, 41, 0xe0e0e0); set(g, 25, 41, 0xe0e0e0);
  } else if (accId.includes("pet_cat")) {
    fillRect(g, 52, 39, 55, 43, c.acc);
    set(g, 51, 39, c.acc); set(g, 51, 43, c.acc);
    set(g, 52, 40, c.eye); set(g, 52, 42, c.eye);
    set(g, 55, 44, c.acc); set(g, 56, 45, darkenColor(c.acc, 0.2));
  } else if (accId.includes("pet_dog")) {
    fillRect(g, 52, 39, 55, 43, c.acc);
    set(g, 51, 38, darkenColor(c.acc, 0.2)); set(g, 51, 44, darkenColor(c.acc, 0.2));
    set(g, 52, 40, c.eye); set(g, 52, 42, c.eye);
    set(g, 55, 44, c.acc); set(g, 56, 45, c.acc);
  }
}

// ─── SHADOW (with gradient) ───
function drawShadow(g: Grid) {
  fillRow(g, 58, 12, 34, -1);
  fillRow(g, 59, 14, 32, -1);
  fillRow(g, 60, 15, 31, -2);
  fillRow(g, 61, 16, 30, -2);
}

// ─── HD AUTO-OUTLINE — anti-aliased thick border ───
function addHDOutline(g: Grid, outlineColor: number, softColor: number) {
  const snap = g.map(r => [...r]);
  const dirs4: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const dirs8: [number, number][] = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

  // Pass 1: primary outline
  for (let r = 0; r < GRID_H; r++) {
    for (let c = 0; c < GRID_W; c++) {
      if (snap[r][c] !== null && snap[r][c]! > 0) {
        for (const [dr, dc] of dirs4) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < GRID_H && nc >= 0 && nc < GRID_W && snap[nr][nc] === null) {
            g[nr][nc] = outlineColor;
          }
        }
      }
    }
  }

  // Pass 2: soft anti-alias on diagonals
  const snap2 = g.map(r => [...r]);
  for (let r = 0; r < GRID_H; r++) {
    for (let c = 0; c < GRID_W; c++) {
      if (snap[r][c] !== null && snap[r][c]! > 0) {
        for (const [dr, dc] of dirs8) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < GRID_H && nc >= 0 && nc < GRID_W && snap2[nr][nc] === null) {
            g[nr][nc] = softColor;
          }
        }
      }
    }
  }
}

// ─── RENDER GRID → PIXI (with shadow alpha levels) ───
function renderGrid(container: Container, grid: Grid) {
  const gfx = new Graphics();

  for (let r = 0; r < GRID_H; r++) {
    for (let c = 0; c < GRID_W; c++) {
      const color = grid[r][c];
      if (color === -1) {
        gfx.rect(c, r, 1, 1).fill({ color: 0x000000, alpha: 0.18 });
      } else if (color === -2) {
        gfx.rect(c, r, 1, 1).fill({ color: 0x000000, alpha: 0.08 });
      } else if (color !== null) {
        gfx.rect(c, r, 1, 1).fill(color);
      }
    }
  }

  container.addChild(gfx);
}
