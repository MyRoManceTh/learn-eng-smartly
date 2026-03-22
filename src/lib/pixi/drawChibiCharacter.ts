/**
 * HD-2D Pixel Art Character — Cute chibi style
 * 48×64 grid with multi-level shading
 *
 * Redesigned: proportional cute face, smaller expressive eyes,
 * balanced head-to-body ratio
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
  skinRim: number;
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
  const accItem = equipped.rightHand ? getItemById(equipped.rightHand) : null;

  const skin = parseColor(skinItem?.svgProps?.color || "#F5D5C0");
  const hair = parseColor(hairColorItem?.svgProps?.color || "#2C2C2C");
  const shirt = parseColor(shirtItem?.svgProps?.color || "#4DB6AC");
  const pants = parseColor(pantsItem?.svgProps?.color || "#4A90E2");
  const shoes = parseColor(shoesItem?.svgProps?.color || "#F0F0F0");
  const hat = null;
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
    outline: 0x1a1a2e,
    outlineSoft: 0x2a2a45,
    eye: 0x1a1a2e,
    eyeIris: iris,
    eyeIrisHi: lightenColor(iris, 0.3),
    eyeIrisDeep: darkenColor(iris, 0.3),
    mouth: 0xc06060,
    white: 0xffffff,
    blush: 0xffb8b8,
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

  drawAccessoryBack(grid, equipped.rightHand, c);
  drawBody(grid, equipped.shirt, c);
  drawArms(grid, c);
  drawLegs(grid, equipped.pants, c, walkFrame);
  drawShoes(grid, equipped.shoes, c, walkFrame);
  drawHead(grid, c);
  drawHair(grid, hairStyle, c);
  drawFace(grid, c, equipped.rightHand);
  drawAccessoryFront(grid, equipped.rightHand, c);
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

// ─── HEAD (rows 6-26) — round chibi head ───
function drawHead(g: Grid, c: Colors) {
  // Round head, centered at (15, 23), radius 10x11
  fillEllipse(g, 15, 23, 10, 11, c.skin);

  // Top-left highlight
  fillEllipse(g, 11, 19, 3, 5, c.skinHi);

  // Right side shading
  for (let r = 7; r <= 24; r++) {
    const d = Math.abs(r - 15);
    const edgeC = 34 - Math.floor(d * d * 0.08);
    for (let col = edgeC; col <= 34; col++) {
      if (g[r]?.[col] === c.skin) {
        g[r][col] = c.skinShade;
      }
    }
  }

  // Bottom chin shading
  for (let r = 22; r <= 25; r++) {
    for (let col = 14; col <= 32; col++) {
      if (g[r]?.[col] === c.skin) {
        dither(g, r, col, c.skinShade, c.skinDeep);
      }
    }
  }

  // Warm rim light on left edge
  for (let r = 9; r <= 21; r++) {
    if (g[r]?.[12] !== null) set(g, r, 12, c.skinRim);
    if (g[r]?.[13] !== null) set(g, r, 13, c.skinRim);
  }

  // Neck (rows 25-28)
  fillRect(g, 25, 19, 28, 27, c.skin);
  fillRect(g, 25, 25, 28, 27, c.skinShade);
  ditherRow(g, 27, 19, 24, c.skin, c.skinShade);
}

// ─── FACE — cute proportional eyes ───
function drawFace(g: Grid, c: Colors, accId: string | null) {
  const hasGlasses = accId === "acc_glasses";
  const cx = 23; // face center x

  // ── Eyebrows (row 11) — thin expressive ──
  fillRow(g, 11, 15, 18, c.eye);
  fillRow(g, 11, 28, 31, c.eye);

  // ── LEFT EYE (rows 13-17, cols 15-19) — 5x5 cute eye ──
  // Top lid
  fillRow(g, 13, 15, 19, c.eye);
  // Sclera
  fillRect(g, 14, 15, 16, 19, c.white);
  // Iris
  set(g, 14, 17, c.eyeIrisHi); set(g, 14, 18, c.eyeIrisHi);
  set(g, 15, 17, c.eyeIris); set(g, 15, 18, c.eyeIris);
  set(g, 16, 17, c.eyeIrisDeep); set(g, 16, 18, c.eyeIrisDeep);
  // Pupil
  set(g, 15, 17, c.eye); set(g, 15, 18, c.eye);
  // Highlight sparkle
  set(g, 14, 16, c.white);
  set(g, 16, 19, c.white); // small bottom sparkle
  // Bottom lid
  fillRow(g, 17, 15, 19, c.eye);

  // ── RIGHT EYE (rows 13-17, cols 27-31) — mirror ──
  fillRow(g, 13, 27, 31, c.eye);
  fillRect(g, 14, 27, 16, 31, c.white);
  set(g, 14, 28, c.eyeIrisHi); set(g, 14, 29, c.eyeIrisHi);
  set(g, 15, 28, c.eyeIris); set(g, 15, 29, c.eyeIris);
  set(g, 16, 28, c.eyeIrisDeep); set(g, 16, 29, c.eyeIrisDeep);
  set(g, 15, 28, c.eye); set(g, 15, 29, c.eye);
  set(g, 14, 30, c.white);
  set(g, 16, 27, c.white);
  fillRow(g, 17, 27, 31, c.eye);

  // ── Blush (rows 18-19) — soft pink ──
  set(g, 18, 14, c.blush); set(g, 18, 15, c.blush);
  set(g, 19, 14, c.blush); set(g, 19, 15, c.blush);
  set(g, 18, 31, c.blush); set(g, 18, 32, c.blush);
  set(g, 19, 31, c.blush); set(g, 19, 32, c.blush);

  // ── Nose ──
  set(g, 19, cx, c.skinShade);
  set(g, 20, cx, c.skinDeep);

  // ── Mouth — small smile ──
  set(g, 21, 21, c.mouth);
  fillRow(g, 21, 22, 24, c.mouth);
  set(g, 21, 25, c.mouth);
  // Teeth highlight
  set(g, 21, 23, c.white);

  // ── Glasses overlay ──
  if (hasGlasses) {
    fillRow(g, 12, 13, 21, c.acc);
    set(g, 13, 13, c.acc); set(g, 13, 21, c.acc);
    set(g, 14, 13, c.acc); set(g, 14, 21, c.acc);
    set(g, 15, 13, c.acc); set(g, 15, 21, c.acc);
    set(g, 16, 13, c.acc); set(g, 16, 21, c.acc);
    fillRow(g, 17, 13, 21, c.acc);
    // Bridge
    fillRow(g, 14, 22, 24, c.acc);
    // Right lens
    fillRow(g, 12, 25, 33, c.acc);
    set(g, 13, 25, c.acc); set(g, 13, 33, c.acc);
    set(g, 14, 25, c.acc); set(g, 14, 33, c.acc);
    set(g, 15, 25, c.acc); set(g, 15, 33, c.acc);
    set(g, 16, 25, c.acc); set(g, 16, 33, c.acc);
    fillRow(g, 17, 25, 33, c.acc);
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
  const { hair: h, hairHi: hi, hairMid: mid, hairDark: dk } = c;
  fillRow(g, 2, 17, 29, h);
  fillRow(g, 3, 14, 32, h);
  ditherRow(g, 3, 15, 17, hi, h);
  fillRow(g, 4, 12, 34, h);
  set(g, 4, 13, hi); set(g, 4, 14, hi); set(g, 4, 15, hi);
  fillRow(g, 5, 10, 36, h);
  set(g, 5, 11, hi); set(g, 5, 12, hi);
  fillRect(g, 6, 9, 8, 37, h);
  // Hair shine
  fillRow(g, 4, 18, 22, hi);
  ditherRow(g, 5, 17, 23, hi, mid);
  fillRow(g, 6, 19, 21, hi);
  // Sides
  for (let r = 9; r <= 12; r++) {
    set(g, r, 8, h); set(g, r, 9, h); set(g, r, 10, h);
    set(g, r, 36, dk); set(g, r, 37, dk);
  }
  set(g, 13, 9, dk); set(g, 13, 10, dk);
  set(g, 13, 37, dk);
  for (let r = 10; r <= 12; r++) {
    dither(g, r, 35, h, dk);
  }
}

function drawLongHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi, hairMid: mid, hairDark: dk, hairDeep: dp } = c;
  fillRow(g, 2, 17, 29, h);
  fillRow(g, 3, 14, 32, h);
  fillRow(g, 4, 12, 34, h);
  set(g, 4, 13, hi); set(g, 4, 14, hi);
  fillRow(g, 5, 10, 36, h);
  set(g, 5, 11, hi);
  fillRect(g, 6, 9, 8, 37, h);
  fillRow(g, 4, 18, 22, hi);
  ditherRow(g, 5, 17, 23, hi, mid);
  for (let r = 9; r <= 17; r++) {
    set(g, r, 6, h); set(g, r, 7, h); set(g, r, 8, h); set(g, r, 9, h); set(g, r, 10, h);
    set(g, r, 36, h); set(g, r, 37, h); set(g, r, 38, h); set(g, r, 39, dk);
  }
  for (let r = 18; r <= 27; r++) {
    set(g, r, 6, dk); set(g, r, 7, dk); set(g, r, 8, dk); set(g, r, 9, dk);
    set(g, r, 37, dk); set(g, r, 38, dp); set(g, r, 39, dp);
    dither(g, r, 10, h, dk);
  }
  set(g, 28, 7, dp); set(g, 28, 8, dp); set(g, 28, 9, dp);
  set(g, 28, 38, dp); set(g, 28, 39, dp);
  for (let r = 12; r <= 22; r += 3) {
    set(g, r, 7, mid); set(g, r, 37, mid);
  }
}

function drawPonytailHair(g: Grid, c: Colors) {
  drawShortHair(g, c);
  const { hair: h, hairHi: hi, hairDark: dk, hairDeep: dp } = c;
  fillRect(g, 5, 37, 6, 39, h);
  set(g, 7, 38, h); set(g, 7, 39, h); set(g, 7, 40, h);
  set(g, 8, 39, h); set(g, 8, 40, h); set(g, 8, 41, h);
  for (let r = 9; r <= 14; r++) {
    set(g, r, 40, h); set(g, r, 41, dk);
  }
  set(g, 15, 41, dp); set(g, 16, 40, dp);
  set(g, 6, 37, 0xe91e63); set(g, 6, 38, 0xe91e63);
  set(g, 7, 37, 0xe91e63);
  set(g, 9, 40, hi); set(g, 10, 40, hi);
}

function drawBunHair(g: Grid, c: Colors) {
  drawShortHair(g, c);
  const { hair: h, hairHi: hi } = c;
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
  for (let r = 9; r <= 17; r++) {
    const bump = r % 3 === 0 ? 2 : 0;
    set(g, r, 4 - bump, h); set(g, r, 5 - bump, h); set(g, r, 6, h); set(g, r, 7, h); set(g, r, 8, h);
    set(g, r, 38, h); set(g, r, 39, h); set(g, r, 40, dk); set(g, r, 41 + bump, dk);
  }
  set(g, 18, 7, dp); set(g, 18, 8, dp);
  set(g, 18, 39, dp); set(g, 18, 40, dp);
  fillRow(g, 4, 18, 22, hi);
  ditherRow(g, 5, 17, 23, hi, h);
}

function drawSpikeHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi, hairDark: dk } = c;
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
  for (let r = 9; r <= 15; r++) {
    set(g, r, 4, h); set(g, r, 5, h); set(g, r, 6, h); set(g, r, 7, h);
    set(g, r, 39, dk); set(g, r, 40, dk); set(g, r, 41, dp);
  }
  set(g, 16, 6, dp); set(g, 16, 7, dp);
  set(g, 16, 40, dp);
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

// ─── BODY / SHIRT (rows 28-38) ───
function drawBody(g: Grid, shirtId: string, c: Colors) {
  // Collar / shoulders
  fillRow(g, 29, 13, 33, c.shirt);
  set(g, 29, 14, c.shirtHi); set(g, 29, 15, c.shirtHi);

  // Torso
  fillRect(g, 30, 13, 37, 33, c.shirt);

  // Left side highlight
  for (let r = 30; r <= 34; r++) {
    set(g, r, 13, c.shirtHi); set(g, r, 14, c.shirtHi);
    dither(g, r, 15, c.shirtHi, c.shirt);
  }

  // Right side shadow
  for (let r = 30; r <= 37; r++) {
    set(g, r, 32, c.shirtShade); set(g, r, 33, c.shirtShade);
    dither(g, r, 31, c.shirt, c.shirtShade);
  }

  // Bottom fold
  ditherRow(g, 36, 15, 31, c.shirt, c.shirtShade);
  fillRow(g, 37, 15, 32, c.shirtShade);
  set(g, 31, 13, c.shirtDeep); set(g, 31, 33, c.shirtDeep);

  // Waist
  fillRow(g, 38, 15, 31, c.shirtShade);

  applyShirtPattern(g, shirtId, c);
}

function applyShirtPattern(g: Grid, shirtId: string, c: Colors) {
  if (shirtId.includes("striped")) {
    ditherRow(g, 32, 15, 31, c.shirtShade, c.shirt);
    ditherRow(g, 35, 15, 31, c.shirtShade, c.shirt);
  } else if (shirtId.includes("superhero")) {
    set(g, 32, 22, 0xffd700); set(g, 32, 23, 0xffd700); set(g, 32, 24, 0xffd700);
    set(g, 33, 21, 0xffd700); set(g, 33, 22, 0xffd700); set(g, 33, 23, 0xffd700); set(g, 33, 24, 0xffd700); set(g, 33, 25, 0xffd700);
    set(g, 34, 22, 0xffd700); set(g, 34, 23, 0xffd700); set(g, 34, 24, 0xffd700);
  } else if (shirtId.includes("hoodie")) {
    set(g, 29, 19, c.shirtShade); set(g, 29, 27, c.shirtShade);
    set(g, 30, 20, c.shirtShade); set(g, 30, 26, c.shirtShade);
    fillRect(g, 35, 18, 37, 28, c.shirtShade);
  } else if (shirtId.includes("tuxedo")) {
    fillRect(g, 30, 20, 36, 26, 0xf0f0f0);
    set(g, 30, 17, c.shirtShade); set(g, 30, 18, c.shirtShade);
    set(g, 30, 28, c.shirtShade); set(g, 30, 29, c.shirtShade);
    set(g, 29, 22, 0xd32f2f); set(g, 29, 23, 0xd32f2f); set(g, 29, 24, 0xd32f2f);
    set(g, 30, 23, 0xb71c1c); set(g, 31, 23, 0xb71c1c);
    set(g, 32, 23, 0xb71c1c); set(g, 33, 23, 0xb71c1c);
  } else if (shirtId.includes("dragon")) {
    set(g, 32, 20, lightenColor(c.shirt, 0.2)); set(g, 32, 26, lightenColor(c.shirt, 0.2));
    set(g, 34, 22, 0xffd700); set(g, 34, 23, 0xffd700); set(g, 34, 24, 0xffd700);
  } else if (shirtId.includes("galaxy")) {
    set(g, 31, 16, 0xffffff); set(g, 33, 27, 0xffffff); set(g, 35, 20, 0xffffff);
    set(g, 32, 29, 0x7c4dff); set(g, 36, 16, 0x7c4dff);
  }
}

// ─── ARMS (rows 30-39) ───
function drawArms(g: Grid, c: Colors) {
  // Left arm — sleeve
  fillRect(g, 30, 8, 33, 12, c.shirt);
  set(g, 30, 8, c.shirtHi); set(g, 30, 9, c.shirtHi);
  set(g, 31, 8, c.shirtHi);
  set(g, 33, 12, c.shirtShade);
  // Forearm skin
  fillRect(g, 34, 8, 37, 12, c.skin);
  set(g, 36, 8, c.skinHi);
  set(g, 37, 12, c.skinShade);
  // Hand
  fillRect(g, 38, 8, 40, 12, c.skin);
  set(g, 38, 8, c.skinHi);
  set(g, 39, 8, c.skinShade); set(g, 39, 9, c.skinShade);
  set(g, 40, 9, c.skinShade); set(g, 40, 10, c.skin);
  set(g, 40, 11, c.skinShade);

  // Right arm — sleeve (darker)
  fillRect(g, 30, 34, 33, 38, c.shirtShade);
  set(g, 30, 34, c.shirt);
  dither(g, 31, 34, c.shirt, c.shirtShade);
  // Forearm
  fillRect(g, 34, 34, 37, 38, c.skinShade);
  set(g, 34, 34, c.skin); set(g, 35, 34, c.skin);
  // Hand
  fillRect(g, 38, 34, 40, 38, c.skinShade);
  set(g, 38, 34, c.skin); set(g, 38, 35, c.skin);
  set(g, 40, 35, c.skinDeep); set(g, 40, 36, c.skinShade);
}

// ─── LEGS / PANTS (rows 39-50) ───
function drawLegs(g: Grid, pantsId: string, c: Colors, walkFrame: number = 0) {
  const isShorts = pantsId.includes("shorts");
  const isSkirt = pantsId.includes("skirt");

  const lOff = walkFrame === 1 ? -3 : walkFrame === 2 ? 3 : 0;
  const rOff = walkFrame === 1 ? 3 : walkFrame === 2 ? -3 : 0;

  if (isSkirt) {
    fillRow(g, 39, 13, 33, c.pants);
    fillRow(g, 40, 11, 35, c.pants);
    fillRow(g, 41, 10, 36, c.pants);
    set(g, 41, 10, c.pantsShade); set(g, 41, 36, c.pantsShade);
    ditherRow(g, 41, 33, 36, c.pants, c.pantsShade);
    fillRect(g, 42, 15 + lOff, 49, 21 + lOff, c.skin);
    fillRect(g, 42, 25 + rOff, 49, 31 + rOff, c.skin);
    for (let r = 42; r <= 49; r++) {
      set(g, r, 21 + lOff, c.skinShade);
      set(g, r, 31 + rOff, c.skinShade);
    }
  } else {
    // Waist band
    fillRow(g, 39, 15, 31, c.pants);
    ditherRow(g, 39, 15, 31, c.pantsHi, c.pants);

    // Left leg
    fillRect(g, 40, 15 + lOff, 46, 21 + lOff, c.pants);
    // Right leg
    fillRect(g, 40, 25 + rOff, 46, 31 + rOff, c.pants);

    if (walkFrame === 0) {
      ditherRow(g, 40, 21, 25, c.pantsShade, c.pantsDeep);
    }

    // Shading
    for (let r = 40; r <= 46; r++) {
      set(g, r, 21 + lOff, c.pantsShade);
      set(g, r, 31 + rOff, c.pantsShade);
      dither(g, r, 20 + lOff, c.pants, c.pantsShade);
      dither(g, r, 30 + rOff, c.pants, c.pantsShade);
    }

    if (isShorts) {
      fillRect(g, 44, 15 + lOff, 49, 21 + lOff, c.skin);
      fillRect(g, 44, 25 + rOff, 49, 31 + rOff, c.skin);
      for (let r = 44; r <= 49; r++) {
        set(g, r, 21 + lOff, c.skinShade);
        set(g, r, 31 + rOff, c.skinShade);
      }
    } else {
      fillRect(g, 47, 15 + lOff, 49, 21 + lOff, c.pantsShade);
      fillRect(g, 47, 25 + rOff, 49, 31 + rOff, c.pantsShade);
      ditherRow(g, 47, 15 + lOff, 21 + lOff, c.pants, c.pantsShade);
      ditherRow(g, 47, 25 + rOff, 31 + rOff, c.pants, c.pantsShade);
    }
  }
}

// ─── SHOES (rows 50-54) ───
function drawShoes(g: Grid, shoesId: string, c: Colors, walkFrame: number = 0) {
  const isRocket = shoesId.includes("rocket");
  const isBoots = shoesId.includes("boots") && !isRocket;
  const isHeels = shoesId.includes("heels");
  const isCloud = shoesId.includes("cloud");

  const lOff = walkFrame === 1 ? -3 : walkFrame === 2 ? 3 : 0;
  const rOff = walkFrame === 1 ? 3 : walkFrame === 2 ? -3 : 0;

  // Left shoe
  fillRect(g, 50, 13 + lOff, 52, 22 + lOff, c.shoes);
  fillRow(g, 53, 13 + lOff, 22 + lOff, c.shoesShade);
  set(g, 50, 14 + lOff, c.shoesHi); set(g, 50, 15 + lOff, c.shoesHi);
  dither(g, 51, 14 + lOff, c.shoesHi, c.shoes);

  // Right shoe
  fillRect(g, 50, 24 + rOff, 52, 33 + rOff, c.shoes);
  fillRow(g, 53, 24 + rOff, 33 + rOff, c.shoesShade);
  set(g, 50, 25 + rOff, c.shoesHi); set(g, 50, 26 + rOff, c.shoesHi);
  dither(g, 51, 25 + rOff, c.shoesHi, c.shoes);

  if (isRocket) {
    fillRow(g, 54, 15 + lOff, 20 + lOff, 0xff6d00);
    fillRow(g, 54, 27 + rOff, 32 + rOff, 0xff6d00);
    set(g, 54, 17 + lOff, 0xffab00); set(g, 54, 29 + rOff, 0xffab00);
  } else if (isBoots) {
    fillRect(g, 47, 13 + lOff, 49, 22 + lOff, c.shoes);
    fillRect(g, 47, 24 + rOff, 49, 33 + rOff, c.shoes);
  } else if (isHeels) {
    set(g, 54, 13 + lOff, c.shoesShade); set(g, 54, 14 + lOff, c.shoesShade);
    set(g, 54, 24 + rOff, c.shoesShade); set(g, 54, 25 + rOff, c.shoesShade);
  } else if (isCloud) {
    fillRow(g, 54, 13 + lOff, 21 + lOff, 0xe3f2fd);
    set(g, 54, 15 + lOff, 0xbbdefb); set(g, 54, 18 + lOff, 0xbbdefb);
    fillRow(g, 54, 24 + rOff, 32 + rOff, 0xe3f2fd);
    set(g, 54, 26 + rOff, 0xbbdefb); set(g, 54, 29 + rOff, 0xbbdefb);
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
    fillRect(g, 10, 5, 14, 10, h);
    fillRect(g, 15, 5, 16, 10, sh);
    fillRect(g, 10, 36, 14, 41, h);
    fillRect(g, 15, 36, 16, 41, sh);
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
    fillRect(g, 10, 13, 16, 33, 0x42a5f5);
    set(g, 10, 14, 0x90caf9); set(g, 10, 15, 0x90caf9); set(g, 10, 16, 0x90caf9);
    set(g, 11, 14, 0x90caf9);
  }
}

// ─── ACCESSORIES (back) ───
function drawAccessoryBack(g: Grid, accId: string | null, c: Colors) {
  if (!accId) return;
  if (accId.includes("cape")) {
    fillRect(g, 30, 3, 34, 7, c.acc);
    fillRect(g, 35, 2, 39, 7, c.acc);
    set(g, 39, 3, darkenColor(c.acc, 0.2)); set(g, 39, 4, darkenColor(c.acc, 0.2));
    fillRect(g, 30, 39, 34, 43, c.acc);
    fillRect(g, 35, 39, 39, 44, c.acc);
    set(g, 39, 43, darkenColor(c.acc, 0.2)); set(g, 39, 44, darkenColor(c.acc, 0.2));
  } else if (accId.includes("wings")) {
    fillRect(g, 29, 2, 32, 7, c.acc);
    set(g, 29, 2, lightenColor(c.acc, 0.2)); set(g, 29, 3, lightenColor(c.acc, 0.2));
    fillRect(g, 29, 39, 32, 44, c.acc);
    set(g, 29, 43, lightenColor(c.acc, 0.2)); set(g, 29, 44, lightenColor(c.acc, 0.2));
  } else if (accId.includes("backpack")) {
    fillRect(g, 29, 38, 37, 43, c.acc);
    set(g, 35, 39, darkenColor(c.acc, 0.15)); set(g, 35, 40, darkenColor(c.acc, 0.15));
    set(g, 37, 38, darkenColor(c.acc, 0.2)); set(g, 37, 43, darkenColor(c.acc, 0.2));
  } else if (accId.includes("shield")) {
    fillRect(g, 30, 2, 37, 7, c.acc);
    set(g, 30, 3, lightenColor(c.acc, 0.2)); set(g, 30, 4, lightenColor(c.acc, 0.2));
    set(g, 37, 3, darkenColor(c.acc, 0.2)); set(g, 37, 4, darkenColor(c.acc, 0.2));
  }
}

// ─── ACCESSORIES (front) ───
function drawAccessoryFront(g: Grid, accId: string | null, c: Colors) {
  if (!accId) return;
  if (accId.includes("sword")) {
    for (let r = 19; r <= 29; r++) set(g, r, 41, 0xc0c0c0);
    set(g, 30, 41, 0x8d6e63); set(g, 31, 41, 0x8d6e63);
    set(g, 29, 40, 0xffd700); set(g, 29, 42, 0xffd700);
    set(g, 32, 41, 0x5d4037);
    set(g, 21, 41, 0xe0e0e0); set(g, 24, 41, 0xe0e0e0);
  } else if (accId.includes("pet_cat")) {
    fillRect(g, 51, 39, 54, 43, c.acc);
    set(g, 50, 39, c.acc); set(g, 50, 43, c.acc);
    set(g, 51, 40, c.eye); set(g, 51, 42, c.eye);
    set(g, 54, 44, c.acc); set(g, 55, 45, darkenColor(c.acc, 0.2));
  } else if (accId.includes("pet_dog")) {
    fillRect(g, 51, 39, 54, 43, c.acc);
    set(g, 50, 38, darkenColor(c.acc, 0.2)); set(g, 50, 44, darkenColor(c.acc, 0.2));
    set(g, 51, 40, c.eye); set(g, 51, 42, c.eye);
    set(g, 54, 44, c.acc); set(g, 55, 45, c.acc);
  }
}

// ─── SHADOW ───
function drawShadow(g: Grid) {
  fillRow(g, 57, 13, 33, -1);
  fillRow(g, 58, 15, 31, -1);
  fillRow(g, 59, 16, 30, -2);
  fillRow(g, 60, 17, 29, -2);
}

// ─── HD AUTO-OUTLINE — anti-aliased thick border ───
function addHDOutline(g: Grid, outlineColor: number, softColor: number) {
  const snap = g.map(r => [...r]);
  const dirs4: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const dirs8: [number, number][] = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

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

// ─── RENDER GRID → PIXI ───
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
