/**
 * Pixel Art Chibi Character - True 8-bit style (32x42 grid)
 *
 * Each cell = 1 pixel, CSS upscaled with imageRendering: pixelated.
 * Big-head chibi proportions with detailed features.
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
  hair: number;
  hairHi: number;
  hairDark: number;
  shirt: number;
  shirtShade: number;
  pants: number;
  pantsShade: number;
  shoes: number;
  shoesShade: number;
  hat: number | null;
  hatShade: number | null;
  acc: number;
  outline: number;
  eye: number;
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
    skinShade: darkenColor(skin, 0.18),
    hair,
    hairHi: lightenColor(hair, 0.2),
    hairDark: darkenColor(hair, 0.2),
    shirt,
    shirtShade: darkenColor(shirt, 0.2),
    pants,
    pantsShade: darkenColor(pants, 0.2),
    shoes,
    shoesShade: darkenColor(shoes, 0.25),
    hat,
    hatShade: hat ? darkenColor(hat, 0.2) : null,
    acc: accItem ? parseColor(accItem.svgProps?.color || "#80DEEA") : 0x80deea,
    outline: 0x1a1a2e,
    eye: 0x1a1a2e,
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
  addOutline(grid, c.outline);
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

// ─── HEAD (rows 5-16) 16 wide centered ───
function drawHead(g: Grid, c: Colors) {
  // Top of head (narrower)
  fillRow(g, 5, 10, 21, c.skin);
  // Full width head
  fillRect(g, 6, 8, 14, 23, c.skin);
  // Chin (narrower)
  fillRow(g, 15, 9, 22, c.skin);
  fillRow(g, 16, 10, 21, c.skin);

  // Shading on right side
  for (let r = 6; r <= 14; r++) set(g, r, 23, c.skinShade);
  set(g, 15, 22, c.skinShade);
  // Bottom shadow
  set(g, 14, 8, c.skinShade);
  set(g, 14, 9, c.skinShade);
}

// ─── FACE ───
function drawFace(g: Grid, c: Colors, accId: string | null) {
  const hasGlasses = accId === "acc_glasses";

  // Eyes (row 10-11) — 2px tall for detail
  // Left eye: cols 11-13
  set(g, 10, 11, c.eye); set(g, 10, 12, c.eye);
  set(g, 11, 11, c.eye); set(g, 11, 12, c.eye);
  // Left highlight
  set(g, 10, 13, c.white);

  // Right eye: cols 19-21
  set(g, 10, 19, c.eye); set(g, 10, 20, c.eye);
  set(g, 11, 19, c.eye); set(g, 11, 20, c.eye);
  // Right highlight
  set(g, 10, 21, c.white);

  // Blush (row 12)
  set(g, 12, 9, c.blush); set(g, 12, 10, c.blush);
  set(g, 12, 21, c.blush); set(g, 12, 22, c.blush);

  // Mouth (row 13)
  fillRow(g, 13, 14, 17, c.mouth);

  // Nose hint
  set(g, 12, 15, c.skinShade); set(g, 12, 16, c.skinShade);

  // Glasses
  if (hasGlasses) {
    // Left lens frame
    fillRow(g, 9, 10, 14, c.acc);
    set(g, 10, 10, c.acc); set(g, 10, 14, c.acc);
    set(g, 11, 10, c.acc); set(g, 11, 14, c.acc);
    fillRow(g, 12, 10, 14, c.acc);
    // Bridge
    fillRow(g, 10, 15, 16, c.acc);
    // Right lens frame
    fillRow(g, 9, 17, 22, c.acc);
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
  // Top rows
  fillRow(g, 1, 11, 20, h);
  fillRow(g, 2, 9, 22, h);
  set(g, 2, 10, hi); set(g, 2, 11, hi);
  fillRow(g, 3, 8, 23, h);
  set(g, 3, 9, hi); set(g, 3, 10, hi);
  fillRow(g, 4, 8, 23, h);
  fillRow(g, 5, 7, 24, h);
  set(g, 5, 8, hi);
  // Sides going down
  set(g, 6, 6, h); set(g, 6, 7, h); set(g, 6, 24, h); set(g, 6, 25, dk);
  set(g, 7, 6, h); set(g, 7, 7, h); set(g, 7, 24, dk); set(g, 7, 25, dk);
  set(g, 8, 7, h); set(g, 8, 24, dk);
}

function drawLongHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi, hairDark: dk } = c;
  // Top same as short
  fillRow(g, 1, 11, 20, h);
  fillRow(g, 2, 9, 22, h);
  set(g, 2, 10, hi); set(g, 2, 11, hi);
  fillRow(g, 3, 8, 23, h);
  set(g, 3, 9, hi);
  fillRow(g, 4, 8, 23, h);
  fillRow(g, 5, 7, 24, h);
  // Long sides
  for (let r = 6; r <= 10; r++) {
    set(g, r, 6, h); set(g, r, 7, h);
    set(g, r, 24, h); set(g, r, 25, h);
  }
  for (let r = 11; r <= 16; r++) {
    set(g, r, 6, dk); set(g, r, 7, dk);
    set(g, r, 24, dk); set(g, r, 25, dk);
  }
  set(g, 17, 7, dk); set(g, 17, 24, dk);
}

function drawPonytailHair(g: Grid, c: Colors) {
  drawShortHair(g, c);
  const { hair: h, hairDark: dk } = c;
  // Ponytail right side
  set(g, 4, 25, h); set(g, 5, 26, h); set(g, 5, 27, h);
  set(g, 6, 27, h); set(g, 7, 27, h); set(g, 8, 27, h);
  set(g, 9, 27, dk); set(g, 10, 27, dk); set(g, 11, 26, dk);
  // Hair tie
  set(g, 4, 24, 0xe91e63); set(g, 5, 25, 0xe91e63);
}

function drawBunHair(g: Grid, c: Colors) {
  drawShortHair(g, c);
  const { hair: h, hairHi: hi } = c;
  // Bun on top
  fillRow(g, 0, 13, 18, h);
  fillRow(g, 1, 12, 19, h);
  set(g, 0, 14, hi); set(g, 0, 15, hi);
}

function drawCurlyHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi, hairDark: dk } = c;
  fillRow(g, 1, 10, 21, h);
  fillRow(g, 2, 7, 24, h);
  set(g, 2, 8, hi); set(g, 2, 9, hi);
  fillRow(g, 3, 6, 25, h);
  set(g, 3, 7, hi);
  fillRow(g, 4, 6, 25, h);
  fillRow(g, 5, 5, 26, h);
  // Curly bumps
  for (let r = 6; r <= 10; r++) {
    set(g, r, 4, r % 2 === 0 ? h : dk);
    set(g, r, 5, h); set(g, r, 6, h);
    set(g, r, 25, h); set(g, r, 26, h);
    set(g, r, 27, r % 2 === 0 ? h : dk);
  }
  set(g, 11, 5, dk); set(g, 11, 6, dk);
  set(g, 11, 25, dk); set(g, 11, 26, dk);
}

function drawSpikeHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi, hairDark: dk } = c;
  // Spikes
  set(g, 0, 9, h); set(g, 0, 10, hi);
  set(g, 0, 15, h); set(g, 0, 16, hi);
  set(g, 0, 21, h); set(g, 0, 22, hi);
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
  // Shaved sides
  set(g, 6, 8, c.skinShade); set(g, 6, 23, c.skinShade);
}

// ─── BODY / SHIRT (rows 18-26) ───
function drawBody(g: Grid, shirtId: string, c: Colors) {
  // Neck (row 17-18)
  fillRow(g, 17, 13, 18, c.skin);
  fillRow(g, 18, 13, 18, c.skin);

  // Shoulders (row 19)
  fillRow(g, 19, 9, 22, c.shirt);
  // Body
  fillRect(g, 20, 9, 24, 22, c.shirt);
  // Waist (narrower)
  fillRow(g, 25, 10, 21, c.shirt);

  // Shading right side
  for (let r = 19; r <= 24; r++) {
    set(g, r, 22, c.shirtShade);
  }
  // Bottom shading
  set(g, 25, 21, c.shirtShade);

  applyShirtPattern(g, shirtId, c);
}

function applyShirtPattern(g: Grid, shirtId: string, c: Colors) {
  if (shirtId.includes("striped")) {
    fillRow(g, 21, 10, 21, c.shirtShade);
    fillRow(g, 23, 10, 21, c.shirtShade);
  } else if (shirtId.includes("superhero")) {
    // Star emblem
    set(g, 21, 15, 0xffd700); set(g, 21, 16, 0xffd700);
    set(g, 22, 14, 0xffd700); set(g, 22, 15, 0xffd700); set(g, 22, 16, 0xffd700); set(g, 22, 17, 0xffd700);
    set(g, 23, 15, 0xffd700); set(g, 23, 16, 0xffd700);
  } else if (shirtId.includes("hoodie")) {
    // Hood strings
    set(g, 19, 13, c.shirtShade); set(g, 19, 18, c.shirtShade);
    set(g, 20, 14, c.shirtShade); set(g, 20, 17, c.shirtShade);
    // Kangaroo pocket
    fillRow(g, 23, 12, 19, c.shirtShade);
    fillRow(g, 24, 12, 19, c.shirtShade);
  } else if (shirtId.includes("tuxedo")) {
    // White shirt center
    fillRect(g, 20, 14, 24, 17, 0xf0f0f0);
    // Lapels
    set(g, 20, 11, c.shirtShade); set(g, 20, 12, c.shirtShade);
    set(g, 20, 19, c.shirtShade); set(g, 20, 20, c.shirtShade);
    // Tie
    set(g, 19, 15, 0xd32f2f); set(g, 19, 16, 0xd32f2f);
    set(g, 20, 15, 0xd32f2f); set(g, 20, 16, 0xd32f2f);
    set(g, 21, 15, 0xb71c1c); set(g, 21, 16, 0xb71c1c);
    set(g, 22, 15, 0xb71c1c); set(g, 22, 16, 0xb71c1c);
  } else if (shirtId.includes("dragon")) {
    set(g, 21, 13, lightenColor(c.shirt, 0.2)); set(g, 21, 18, lightenColor(c.shirt, 0.2));
    set(g, 22, 14, lightenColor(c.shirt, 0.15)); set(g, 22, 17, lightenColor(c.shirt, 0.15));
    set(g, 23, 15, 0xffd700); set(g, 23, 16, 0xffd700);
  } else if (shirtId.includes("galaxy")) {
    set(g, 20, 11, 0xffffff); set(g, 21, 18, 0xffffff); set(g, 23, 13, 0xffffff);
    set(g, 22, 20, 0x7c4dff); set(g, 24, 11, 0x7c4dff);
  }
}

// ─── ARMS (rows 20-25) ───
function drawArms(g: Grid, c: Colors) {
  // Left arm (sleeve then hand)
  fillRect(g, 20, 6, 22, 8, c.shirt);
  set(g, 22, 8, c.shirtShade);
  fillRect(g, 23, 6, 25, 8, c.skin);
  set(g, 25, 6, c.skinShade); set(g, 25, 7, c.skinShade);

  // Right arm
  fillRect(g, 20, 23, 22, 25, c.shirtShade);
  fillRect(g, 23, 23, 25, 25, c.skinShade);
  set(g, 23, 23, c.skin); set(g, 24, 23, c.skin);
}

// ─── LEGS / PANTS (rows 26-33) ───
function drawLegs(g: Grid, pantsId: string, c: Colors, walkFrame: number = 0) {
  const isShorts = pantsId.includes("shorts");
  const isSkirt = pantsId.includes("skirt");

  // Walk offsets: ±2px for 32-wide grid
  const lOff = walkFrame === 1 ? -2 : walkFrame === 2 ? 2 : 0;
  const rOff = walkFrame === 1 ? 2 : walkFrame === 2 ? -2 : 0;

  if (isSkirt) {
    // Skirt top (stays still)
    fillRow(g, 26, 9, 22, c.pants);
    fillRow(g, 27, 8, 23, c.pants);
    fillRow(g, 28, 7, 24, c.pants);
    set(g, 28, 7, c.pantsShade); set(g, 28, 24, c.pantsShade);
    // Legs below skirt (move with walk)
    fillRect(g, 29, 10 + lOff, 31, 14 + lOff, c.skin);
    fillRect(g, 29, 17 + rOff, 31, 21 + rOff, c.skin);
    fillRect(g, 32, 10 + lOff, 33, 14 + lOff, c.skin);
    fillRect(g, 32, 17 + rOff, 33, 21 + rOff, c.skin);
  } else {
    // Waist (stays still)
    fillRow(g, 26, 10, 21, c.pants);
    // Upper legs (slight split, move with walk below)
    fillRow(g, 27, 10 + lOff, 14 + lOff, c.pants); fillRow(g, 27, 17 + rOff, 21 + rOff, c.pants);
    if (walkFrame === 0) { fillRow(g, 27, 14, 17, c.pantsShade); } // seam when standing
    fillRow(g, 28, 10 + lOff, 14 + lOff, c.pants); fillRow(g, 28, 17 + rOff, 21 + rOff, c.pants);

    if (isShorts) {
      // Exposed legs below shorts
      fillRect(g, 29, 10 + lOff, 31, 14 + lOff, c.skin);
      fillRect(g, 29, 17 + rOff, 31, 21 + rOff, c.skin);
      fillRect(g, 32, 10 + lOff, 33, 14 + lOff, c.skin);
      fillRect(g, 32, 17 + rOff, 33, 21 + rOff, c.skin);
    } else {
      // Full pants
      fillRect(g, 29, 10 + lOff, 31, 14 + lOff, c.pants);
      fillRect(g, 29, 17 + rOff, 31, 21 + rOff, c.pants);
      // Shade
      set(g, 29, 14 + lOff, c.pantsShade); set(g, 29, 21 + rOff, c.pantsShade);
      set(g, 30, 14 + lOff, c.pantsShade); set(g, 30, 21 + rOff, c.pantsShade);
      // Lower legs
      fillRect(g, 32, 10 + lOff, 33, 14 + lOff, c.pantsShade);
      fillRect(g, 32, 17 + rOff, 33, 21 + rOff, c.pantsShade);
    }
  }
}

// ─── SHOES (rows 34-36) ───
function drawShoes(g: Grid, shoesId: string, c: Colors, walkFrame: number = 0) {
  const isRocket = shoesId.includes("rocket");
  const isBoots = shoesId.includes("boots") && !isRocket;
  const isHeels = shoesId.includes("heels");
  const isCloud = shoesId.includes("cloud");

  const lOff = walkFrame === 1 ? -2 : walkFrame === 2 ? 2 : 0;
  const rOff = walkFrame === 1 ? 2 : walkFrame === 2 ? -2 : 0;

  // Left shoe
  fillRect(g, 34, 8 + lOff, 35, 15 + lOff, c.shoes);
  fillRow(g, 36, 8 + lOff, 15 + lOff, c.shoesShade);
  // Right shoe
  fillRect(g, 34, 16 + rOff, 35, 23 + rOff, c.shoes);
  fillRow(g, 36, 16 + rOff, 23 + rOff, c.shoesShade);

  if (isRocket) {
    fillRow(g, 37, 10 + lOff, 13 + lOff, 0xff6d00);
    fillRow(g, 37, 18 + rOff, 21 + rOff, 0xff6d00);
    set(g, 37, 11 + lOff, 0xffab00); set(g, 37, 19 + rOff, 0xffab00);
  } else if (isBoots) {
    fillRect(g, 32, 8 + lOff, 33, 15 + lOff, c.shoes);
    fillRect(g, 32, 16 + rOff, 33, 23 + rOff, c.shoes);
  } else if (isHeels) {
    set(g, 37, 8 + lOff, c.shoesShade); set(g, 37, 9 + lOff, c.shoesShade);
    set(g, 37, 16 + rOff, c.shoesShade); set(g, 37, 17 + rOff, c.shoesShade);
  } else if (isCloud) {
    fillRow(g, 37, 8 + lOff, 14 + lOff, 0xe3f2fd);
    set(g, 37, 10 + lOff, 0xbbdefb); set(g, 37, 12 + lOff, 0xbbdefb);
    fillRow(g, 37, 16 + rOff, 22 + rOff, 0xe3f2fd);
    set(g, 37, 18 + rOff, 0xbbdefb); set(g, 37, 20 + rOff, 0xbbdefb);
  }
}

// ─── HATS ───
function drawHatPixels(g: Grid, hatId: string, c: Colors) {
  const h = c.hat!;
  const sh = c.hatShade!;

  if (hatId.includes("baseball")) {
    fillRow(g, 1, 9, 22, h);
    fillRow(g, 2, 8, 23, h); set(g, 2, 9, lightenColor(h, 0.15)); set(g, 2, 10, lightenColor(h, 0.15));
    fillRow(g, 3, 8, 23, h);
    fillRow(g, 4, 7, 24, h);
    // Brim
    fillRow(g, 5, 5, 24, sh);
    fillRow(g, 6, 4, 24, sh);
  } else if (hatId.includes("beanie")) {
    set(g, 0, 15, lightenColor(h, 0.3)); set(g, 0, 16, lightenColor(h, 0.3)); // pompom
    fillRow(g, 1, 10, 21, h); set(g, 1, 11, lightenColor(h, 0.15));
    fillRow(g, 2, 9, 22, h);
    fillRow(g, 3, 8, 23, h);
    fillRow(g, 4, 8, 23, h);
    fillRow(g, 5, 8, 23, sh); // ribbed edge
  } else if (hatId.includes("crown")) {
    // Points
    set(g, 0, 9, h); set(g, 0, 10, h);
    set(g, 0, 15, h); set(g, 0, 16, h);
    set(g, 0, 21, h); set(g, 0, 22, h);
    fillRow(g, 1, 9, 22, h);
    // Jewels
    set(g, 1, 12, 0xe53935); set(g, 1, 13, 0xe53935);
    set(g, 1, 18, 0x2196f3); set(g, 1, 19, 0x2196f3);
    fillRow(g, 2, 9, 22, h);
    fillRow(g, 3, 9, 22, h);
    fillRow(g, 4, 9, 22, sh);
  } else if (hatId.includes("wizard")) {
    set(g, 0, 15, h); set(g, 0, 16, h); // tip
    fillRow(g, 1, 12, 19, h);
    set(g, 1, 15, 0xffd700); set(g, 1, 16, 0xffd700); // star
    fillRow(g, 2, 10, 21, h);
    fillRow(g, 3, 8, 23, h);
    fillRow(g, 4, 7, 24, h);
    // Wide brim
    fillRow(g, 5, 5, 26, sh);
    fillRow(g, 6, 4, 27, sh);
  } else if (hatId.includes("santa")) {
    fillRow(g, 0, 18, 24, h);
    set(g, 0, 24, 0xf5f5f5); set(g, 0, 25, 0xf5f5f5); // ball
    fillRow(g, 1, 10, 22, h);
    fillRow(g, 2, 9, 23, h);
    fillRow(g, 3, 8, 23, h);
    fillRow(g, 4, 8, 23, h);
    // White trim
    fillRow(g, 5, 8, 23, 0xf5f5f5);
    fillRow(g, 6, 8, 23, 0xf5f5f5);
  } else if (hatId.includes("headphones")) {
    fillRow(g, 2, 10, 21, h);
    fillRow(g, 3, 10, 21, h);
    // Ear cups
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
    // Visor
    fillRect(g, 7, 9, 11, 22, 0x42a5f5);
    set(g, 7, 10, 0x90caf9); set(g, 7, 11, 0x90caf9); // glare
    set(g, 8, 10, 0x90caf9);
  }
}

// ─── ACCESSORIES (back) ───
function drawAccessoryBack(g: Grid, accId: string | null, c: Colors) {
  if (!accId) return;
  if (accId.includes("cape")) {
    fillRect(g, 20, 3, 22, 5, c.acc);
    fillRect(g, 23, 2, 26, 5, c.acc);
    set(g, 26, 3, darkenColor(c.acc, 0.2));
    fillRect(g, 20, 26, 22, 28, c.acc);
    fillRect(g, 23, 26, 26, 29, c.acc);
    set(g, 26, 28, darkenColor(c.acc, 0.2));
  } else if (accId.includes("wings")) {
    fillRect(g, 19, 2, 21, 5, c.acc);
    set(g, 19, 2, lightenColor(c.acc, 0.2)); set(g, 19, 3, lightenColor(c.acc, 0.2));
    fillRect(g, 19, 26, 21, 29, c.acc);
    set(g, 19, 28, lightenColor(c.acc, 0.2)); set(g, 19, 29, lightenColor(c.acc, 0.2));
  } else if (accId.includes("backpack")) {
    fillRect(g, 19, 25, 24, 28, c.acc);
    set(g, 23, 26, darkenColor(c.acc, 0.15)); set(g, 23, 27, darkenColor(c.acc, 0.15));
    set(g, 24, 25, darkenColor(c.acc, 0.2)); set(g, 24, 28, darkenColor(c.acc, 0.2));
  } else if (accId.includes("shield")) {
    fillRect(g, 20, 2, 24, 5, c.acc);
    set(g, 20, 3, lightenColor(c.acc, 0.2)); set(g, 20, 4, lightenColor(c.acc, 0.2));
    set(g, 24, 3, darkenColor(c.acc, 0.2)); set(g, 24, 4, darkenColor(c.acc, 0.2));
    set(g, 25, 3, darkenColor(c.acc, 0.2)); set(g, 25, 4, darkenColor(c.acc, 0.2));
  }
}

// ─── ACCESSORIES (front) ───
function drawAccessoryFront(g: Grid, accId: string | null, c: Colors) {
  if (!accId) return;
  if (accId.includes("sword")) {
    set(g, 14, 27, 0xc0c0c0); set(g, 15, 27, 0xc0c0c0);
    set(g, 16, 27, 0xc0c0c0); set(g, 17, 27, 0xc0c0c0);
    set(g, 18, 27, 0xc0c0c0); set(g, 19, 27, 0xc0c0c0);
    // Handle
    set(g, 20, 27, 0x8d6e63); set(g, 21, 27, 0x8d6e63);
    // Guard
    set(g, 19, 26, 0xffd700); set(g, 19, 28, 0xffd700);
    set(g, 22, 27, 0x5d4037);
  } else if (accId.includes("pet_cat")) {
    // Small cat to the right
    fillRect(g, 34, 26, 36, 29, c.acc);
    set(g, 33, 26, c.acc); set(g, 33, 29, c.acc); // ears
    set(g, 34, 27, c.eye); set(g, 34, 28, c.eye); // eyes
    set(g, 36, 30, c.acc); set(g, 37, 30, darkenColor(c.acc, 0.2)); // tail
  } else if (accId.includes("pet_dog")) {
    fillRect(g, 34, 26, 36, 29, c.acc);
    set(g, 33, 25, darkenColor(c.acc, 0.2)); set(g, 33, 30, darkenColor(c.acc, 0.2)); // floppy ears
    set(g, 34, 27, c.eye); set(g, 34, 28, c.eye); // eyes
    set(g, 36, 30, c.acc); set(g, 37, 31, c.acc); // tail
  }
}

// ─── SHADOW ───
function drawShadow(g: Grid) {
  fillRow(g, 38, 9, 22, -1);
  fillRow(g, 39, 10, 21, -1);
  fillRow(g, 40, 11, 20, -1);
}

// ─── AUTO-OUTLINE ───
function addOutline(g: Grid, outlineColor: number) {
  const snap = g.map(r => [...r]);
  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  for (let r = 0; r < GRID_H; r++) {
    for (let c = 0; c < GRID_W; c++) {
      if (snap[r][c] !== null && snap[r][c] !== -1) {
        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < GRID_H && nc >= 0 && nc < GRID_W && snap[nr][nc] === null) {
            g[nr][nc] = outlineColor;
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
        g.rect(c, r, 1, 1).fill({ color: 0x000000, alpha: 0.15 });
      } else if (color !== null) {
        g.rect(c, r, 1, 1).fill(color);
      }
    }
  }

  container.addChild(g);
}
