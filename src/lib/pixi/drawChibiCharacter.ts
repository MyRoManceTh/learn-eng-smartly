/**
 * Pixel Art Chibi Character - True 8-bit style
 *
 * Draws characters as a pixel grid (17 wide x 23 tall).
 * Each cell = 1 pixel, CSS upscaled with imageRendering: pixelated.
 * Proportions match classic pixel art chibi: big head, small body.
 */
import { Container, Graphics } from "pixi.js";
import { EquippedItems } from "@/types/avatar";
import { getItemById } from "@/data/avatarItems";
import { parseColor, darkenColor, lightenColor } from "./colorUtils";

export const GRID_W = 17;
export const GRID_H = 23;

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
    mouth: 0x1a1a2e,
    white: 0xffffff,
    blush: 0xffb4b4,
  };
}

// ─── Main entry ───
export function drawChibiCharacter(
  container: Container,
  equipped: EquippedItems,
  _canvasH: number,
  walkFrame: number = 0 // 0=standing, 1=left-forward, 2=right-forward
): void {
  container.removeChildren();

  const c = resolveColors(equipped);
  const grid = createGrid();

  const hairItem = getItemById(equipped.hair);
  const hairStyle = hairItem?.svgProps?.path || "short";
  const hasHat = !!equipped.hat;

  // Draw layers back to front
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

  // Render grid to PixiJS
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

// ─── HEAD (rows 2-8, centered) ───
function drawHead(g: Grid, c: Colors) {
  //        cols: 4-12 (9 wide)
  // Row 2: top of head
  fillRow(g, 2, 5, 11, c.skin);
  // Row 3-4: wider
  fillRow(g, 3, 4, 12, c.skin);
  fillRow(g, 4, 4, 12, c.skin);
  // Row 5: eyes level
  fillRow(g, 5, 4, 12, c.skin);
  // Row 6: cheeks
  fillRow(g, 6, 4, 12, c.skin);
  // Row 7: mouth
  fillRow(g, 7, 4, 12, c.skin);
  // Row 8: chin (narrower)
  fillRow(g, 8, 5, 11, c.skin);

  // Shading on right side
  set(g, 3, 12, c.skinShade);
  set(g, 4, 12, c.skinShade);
  set(g, 5, 12, c.skinShade);
  set(g, 6, 12, c.skinShade);
  set(g, 7, 12, c.skinShade);
}

// ─── FACE (eyes, mouth, blush) ───
function drawFace(g: Grid, c: Colors, accId: string | null) {
  const hasGlasses = accId === "acc_glasses";

  // Eyes (row 5): col 6 and col 10
  set(g, 5, 6, c.eye);
  set(g, 5, 10, c.eye);

  // Eye whites / highlights
  set(g, 5, 7, c.white);
  set(g, 5, 9, c.white);

  // Blush (row 6)
  set(g, 6, 5, c.blush);
  set(g, 6, 11, c.blush);

  // Mouth (row 7)
  set(g, 7, 7, c.mouth);
  set(g, 7, 8, c.mouth);
  set(g, 7, 9, c.mouth);

  // Glasses overlay
  if (hasGlasses) {
    set(g, 5, 5, c.acc);
    set(g, 5, 8, c.acc); // bridge
    set(g, 5, 11, c.acc);
    set(g, 4, 6, c.acc); set(g, 4, 7, c.acc);
    set(g, 4, 9, c.acc); set(g, 4, 10, c.acc);
    set(g, 6, 6, c.acc); set(g, 6, 7, c.acc);
    set(g, 6, 9, c.acc); set(g, 6, 10, c.acc);
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
  // Row 0-1: top hair
  fillRow(g, 0, 6, 10, h);
  fillRow(g, 1, 4, 12, h);
  set(g, 1, 5, hi); set(g, 1, 6, hi);
  // Row 2: over head - hair on top
  fillRow(g, 2, 4, 12, h);
  set(g, 2, 5, hi);
  // Sides
  set(g, 3, 3, h); set(g, 3, 4, h);
  set(g, 3, 12, h); set(g, 3, 13, dk);
  set(g, 4, 3, h);
  set(g, 4, 13, dk);
}

function drawLongHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi, hairDark: dk } = c;
  fillRow(g, 0, 6, 10, h);
  fillRow(g, 1, 4, 12, h);
  set(g, 1, 5, hi); set(g, 1, 6, hi);
  fillRow(g, 2, 4, 12, h);
  set(g, 2, 5, hi);
  // Long sides going down
  set(g, 3, 3, h); set(g, 3, 4, h); set(g, 3, 12, h); set(g, 3, 13, h);
  set(g, 4, 3, h); set(g, 4, 13, h);
  set(g, 5, 3, h); set(g, 5, 13, dk);
  set(g, 6, 3, h); set(g, 6, 13, dk);
  set(g, 7, 3, dk); set(g, 7, 13, dk);
  set(g, 8, 3, dk); set(g, 8, 13, dk);
  set(g, 9, 3, dk); set(g, 9, 13, dk);
}

function drawPonytailHair(g: Grid, c: Colors) {
  drawShortHair(g, c);
  const { hair: h, hairDark: dk } = c;
  // Ponytail right
  set(g, 2, 13, h); set(g, 3, 14, h);
  set(g, 4, 14, h); set(g, 5, 14, h);
  set(g, 6, 14, dk); set(g, 7, 14, dk);
  // Tie
  set(g, 2, 12, 0xe91e63);
}

function drawBunHair(g: Grid, c: Colors) {
  drawShortHair(g, c);
  const { hair: h, hairHi: hi } = c;
  // Bun on top
  fillRow(g, 0, 7, 10, h);
  set(g, 0, 8, hi);
  // Extra rows above (if space in grid, bun sits on row 0)
}

function drawCurlyHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi, hairDark: dk } = c;
  fillRow(g, 0, 5, 11, h);
  set(g, 0, 6, hi);
  fillRow(g, 1, 3, 13, h);
  set(g, 1, 4, hi); set(g, 1, 5, hi);
  fillRow(g, 2, 3, 13, h);
  set(g, 2, 4, hi);
  // Curly bumps on sides
  set(g, 3, 2, h); set(g, 3, 3, h); set(g, 3, 13, h); set(g, 3, 14, h);
  set(g, 4, 2, h); set(g, 4, 3, h); set(g, 4, 13, dk); set(g, 4, 14, dk);
  set(g, 5, 2, dk); set(g, 5, 3, h); set(g, 5, 13, dk);
  set(g, 6, 3, dk); set(g, 6, 13, dk);
}

function drawSpikeHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi, hairDark: dk } = c;
  // Spikes up
  set(g, 0, 5, h); set(g, 0, 8, hi); set(g, 0, 11, h);
  fillRow(g, 1, 4, 12, h);
  set(g, 1, 5, hi); set(g, 1, 9, hi);
  fillRow(g, 2, 4, 12, h);
  set(g, 2, 5, hi);
  set(g, 3, 3, h); set(g, 3, 4, h); set(g, 3, 12, dk); set(g, 3, 13, h);
  set(g, 4, 3, h); set(g, 4, 13, dk);
}

function drawAfroHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi, hairDark: dk } = c;
  fillRow(g, 0, 4, 12, h);
  set(g, 0, 5, hi); set(g, 0, 6, hi);
  fillRow(g, 1, 2, 14, h);
  set(g, 1, 3, hi); set(g, 1, 4, hi);
  fillRow(g, 2, 2, 14, h);
  set(g, 2, 3, hi);
  set(g, 3, 1, h); set(g, 3, 2, h); set(g, 3, 3, h);
  set(g, 3, 13, h); set(g, 3, 14, h); set(g, 3, 15, dk);
  set(g, 4, 1, h); set(g, 4, 2, h);
  set(g, 4, 14, dk); set(g, 4, 15, dk);
  set(g, 5, 2, h); set(g, 5, 14, dk);
  set(g, 6, 2, dk); set(g, 6, 14, dk);
}

function drawMohawkHair(g: Grid, c: Colors) {
  const { hair: h, hairHi: hi } = c;
  // Tall mohawk center strip
  set(g, 0, 7, h); set(g, 0, 8, hi); set(g, 0, 9, h);
  fillRow(g, 1, 6, 10, h);
  set(g, 1, 7, hi);
  fillRow(g, 2, 6, 10, h);
  // Shaved sides
  set(g, 3, 4, c.skinShade); set(g, 3, 12, c.skinShade);
}

// ─── BODY / SHIRT (rows 9-13) ───
function drawBody(g: Grid, shirtId: string, c: Colors) {
  // Neck (row 9)
  fillRow(g, 9, 7, 9, c.skin);

  // Shoulders (row 10)
  fillRow(g, 10, 5, 11, c.shirt);
  // Body rows 11-13
  fillRow(g, 11, 5, 11, c.shirt);
  fillRow(g, 12, 5, 11, c.shirt);
  fillRow(g, 13, 6, 10, c.shirt);

  // Shading right
  set(g, 10, 11, c.shirtShade);
  set(g, 11, 11, c.shirtShade);
  set(g, 12, 11, c.shirtShade);

  // Shirt pattern
  applyShirtPattern(g, shirtId, c);
}

function applyShirtPattern(g: Grid, shirtId: string, c: Colors) {
  if (shirtId.includes("striped")) {
    fillRow(g, 11, 6, 10, c.shirtShade);
  } else if (shirtId.includes("superhero")) {
    set(g, 11, 8, 0xffd700); // star
    set(g, 12, 7, 0xffd700); set(g, 12, 8, 0xffd700); set(g, 12, 9, 0xffd700);
  } else if (shirtId.includes("hoodie")) {
    set(g, 10, 7, c.shirtShade); set(g, 10, 9, c.shirtShade);
    set(g, 11, 8, c.shirtShade); set(g, 12, 8, c.shirtShade);
  } else if (shirtId.includes("tuxedo")) {
    // White shirt center + lapels
    set(g, 11, 8, 0xf0f0f0);
    set(g, 12, 8, 0xf0f0f0);
    set(g, 11, 6, c.shirtShade); set(g, 11, 10, c.shirtShade);
    set(g, 10, 8, 0xd32f2f); // tie knot
    set(g, 11, 8, 0xd32f2f); // tie
    set(g, 12, 8, 0xd32f2f);
  } else if (shirtId.includes("dragon")) {
    set(g, 11, 7, lightenColor(c.shirt, 0.2));
    set(g, 11, 9, lightenColor(c.shirt, 0.2));
    set(g, 12, 8, 0xffd700);
  } else if (shirtId.includes("galaxy")) {
    set(g, 11, 6, 0xffffff); set(g, 12, 9, 0xffffff);
    set(g, 11, 10, 0x7c4dff);
  }
}

// ─── ARMS (rows 11-13, cols 3-4 left, 12-13 right) ───
function drawArms(g: Grid, c: Colors) {
  // Left arm
  set(g, 11, 4, c.shirt);
  set(g, 12, 3, c.shirt); set(g, 12, 4, c.shirtShade);
  set(g, 13, 3, c.skin); set(g, 13, 4, c.skin); // hand

  // Right arm
  set(g, 11, 12, c.shirtShade);
  set(g, 12, 12, c.shirtShade); set(g, 12, 13, c.shirtShade);
  set(g, 13, 12, c.skinShade); set(g, 13, 13, c.skinShade); // hand
}

// ─── LEGS / PANTS (rows 14-18) ───
function drawLegs(g: Grid, pantsId: string, c: Colors, walkFrame: number = 0) {
  const isShorts = pantsId.includes("shorts");
  const isSkirt = pantsId.includes("skirt");

  // Walk frame offsets: shift legs apart (frame 1) or crossed (frame 2)
  const lOff = walkFrame === 1 ? -1 : walkFrame === 2 ? 1 : 0; // left leg
  const rOff = walkFrame === 1 ? 1 : walkFrame === 2 ? -1 : 0; // right leg

  if (isSkirt) {
    // Skirt flares out (top part stays still)
    fillRow(g, 14, 5, 11, c.pants);
    fillRow(g, 15, 4, 12, c.pants);
    set(g, 15, 4, c.pantsShade); set(g, 15, 12, c.pantsShade);
    // Legs below skirt move with walk
    fillRow(g, 16, 5 + lOff, 7 + lOff, c.skin); fillRow(g, 16, 9 + rOff, 11 + rOff, c.skin);
    fillRow(g, 17, 5 + lOff, 7 + lOff, c.skin); fillRow(g, 17, 9 + rOff, 11 + rOff, c.skin);
  } else {
    // Upper legs (waist area stays still)
    fillRow(g, 14, 5, 11, c.pants);
    // Lower upper legs shift with walk
    fillRow(g, 15, 5 + lOff, 7 + lOff, c.pants); fillRow(g, 15, 9 + rOff, 11 + rOff, c.pants);
    if (walkFrame === 0) set(g, 15, 8, c.pantsShade); // seam only when standing
    // Lower legs
    if (isShorts) {
      fillRow(g, 16, 5 + lOff, 7 + lOff, c.skin); fillRow(g, 16, 9 + rOff, 11 + rOff, c.skin);
      fillRow(g, 17, 5 + lOff, 7 + lOff, c.skin); fillRow(g, 17, 9 + rOff, 11 + rOff, c.skin);
    } else {
      fillRow(g, 16, 5 + lOff, 7 + lOff, c.pants); fillRow(g, 16, 9 + rOff, 11 + rOff, c.pants);
      set(g, 16, 11 + rOff, c.pantsShade);
      fillRow(g, 17, 5 + lOff, 7 + lOff, c.pantsShade); fillRow(g, 17, 9 + rOff, 11 + rOff, c.pantsShade);
    }
  }
}

// ─── SHOES (rows 18-19) ───
function drawShoes(g: Grid, shoesId: string, c: Colors, walkFrame: number = 0) {
  const isRocket = shoesId.includes("rocket");
  const isBoots = shoesId.includes("boots") && !isRocket;
  const isHeels = shoesId.includes("heels");
  const isCloud = shoesId.includes("cloud");

  // Walk frame offsets (same as legs)
  const lOff = walkFrame === 1 ? -1 : walkFrame === 2 ? 1 : 0;
  const rOff = walkFrame === 1 ? 1 : walkFrame === 2 ? -1 : 0;

  // Left shoe
  fillRow(g, 18, 4 + lOff, 7 + lOff, c.shoes);
  fillRow(g, 19, 4 + lOff, 7 + lOff, c.shoesShade);
  // Right shoe
  fillRow(g, 18, 9 + rOff, 12 + rOff, c.shoes);
  fillRow(g, 19, 9 + rOff, 12 + rOff, c.shoesShade);

  if (isRocket) {
    set(g, 20, 5 + lOff, 0xff6d00); set(g, 20, 6 + lOff, 0xffab00);
    set(g, 20, 10 + rOff, 0xff6d00); set(g, 20, 11 + rOff, 0xffab00);
  } else if (isBoots) {
    fillRow(g, 17, 4 + lOff, 7 + lOff, c.shoes); fillRow(g, 17, 9 + rOff, 12 + rOff, c.shoes);
  } else if (isHeels) {
    set(g, 20, 4 + lOff, c.shoesShade); set(g, 20, 9 + rOff, c.shoesShade);
  } else if (isCloud) {
    set(g, 20, 4 + lOff, 0xe3f2fd); set(g, 20, 5 + lOff, 0xbbdefb); set(g, 20, 6 + lOff, 0xe3f2fd);
    set(g, 20, 9 + rOff, 0xe3f2fd); set(g, 20, 10 + rOff, 0xbbdefb); set(g, 20, 11 + rOff, 0xe3f2fd);
  }
}

// ─── HATS ───
function drawHatPixels(g: Grid, hatId: string, c: Colors) {
  const h = c.hat!;
  const sh = c.hatShade!;

  if (hatId.includes("baseball")) {
    fillRow(g, 0, 5, 11, h);
    fillRow(g, 1, 4, 12, h); set(g, 1, 5, lightenColor(h, 0.15));
    fillRow(g, 2, 4, 12, h);
    // Brim
    fillRow(g, 3, 2, 12, sh);
  } else if (hatId.includes("beanie")) {
    set(g, 0, 8, lightenColor(h, 0.3)); // pompom
    fillRow(g, 1, 5, 11, h); set(g, 1, 6, lightenColor(h, 0.15));
    fillRow(g, 2, 4, 12, h);
    fillRow(g, 3, 4, 12, sh); // ribbed edge
  } else if (hatId.includes("crown")) {
    set(g, 0, 5, h); set(g, 0, 8, h); set(g, 0, 11, h); // points
    fillRow(g, 1, 5, 11, h);
    set(g, 1, 7, 0xe53935); set(g, 1, 9, 0x2196f3); // jewels
    fillRow(g, 2, 5, 11, h);
  } else if (hatId.includes("wizard")) {
    set(g, 0, 8, h); // tip
    fillRow(g, 1, 6, 10, h); set(g, 1, 8, 0xffd700); // star
    fillRow(g, 2, 4, 12, h);
    fillRow(g, 3, 3, 13, sh); // wide brim
  } else if (hatId.includes("santa")) {
    fillRow(g, 0, 9, 12, h); set(g, 0, 12, 0xf5f5f5); // droopy tip
    fillRow(g, 1, 5, 11, h);
    fillRow(g, 2, 4, 12, h);
    fillRow(g, 3, 4, 12, 0xf5f5f5); // white trim
  } else if (hatId.includes("headphones")) {
    fillRow(g, 1, 5, 11, h);
    // Ear cups
    set(g, 4, 2, h); set(g, 4, 3, h); set(g, 5, 2, sh); set(g, 5, 3, sh);
    set(g, 4, 13, h); set(g, 4, 14, h); set(g, 5, 13, sh); set(g, 5, 14, sh);
  } else if (hatId.includes("halo")) {
    fillRow(g, 0, 5, 11, 0xffd700);
    set(g, 0, 5, 0xffecb3); set(g, 0, 11, 0xffecb3);
  } else if (hatId.includes("devil")) {
    set(g, 0, 3, h); set(g, 1, 4, sh);
    set(g, 0, 13, h); set(g, 1, 12, sh);
  } else if (hatId.includes("astronaut")) {
    fillRow(g, 1, 4, 12, 0xe0e0e0);
    fillRow(g, 2, 3, 13, 0xe0e0e0);
    fillRow(g, 3, 3, 13, 0xe0e0e0);
    // Visor
    fillRow(g, 4, 5, 11, 0x42a5f5);
    fillRow(g, 5, 5, 11, 0x42a5f5);
    set(g, 4, 6, 0x90caf9); // glare
  }
}

// ─── ACCESSORIES (back layer) ───
function drawAccessoryBack(g: Grid, accId: string | null, c: Colors) {
  if (!accId) return;
  if (accId.includes("cape")) {
    set(g, 11, 2, c.acc); set(g, 12, 1, c.acc); set(g, 12, 2, c.acc);
    set(g, 13, 1, c.acc); set(g, 14, 1, darkenColor(c.acc, 0.2));
    set(g, 11, 14, c.acc); set(g, 12, 14, c.acc); set(g, 12, 15, c.acc);
    set(g, 13, 15, c.acc); set(g, 14, 15, darkenColor(c.acc, 0.2));
  } else if (accId.includes("wings")) {
    set(g, 10, 2, c.acc); set(g, 10, 3, c.acc);
    set(g, 11, 1, lightenColor(c.acc, 0.2)); set(g, 11, 2, c.acc); set(g, 11, 3, c.acc);
    set(g, 10, 13, c.acc); set(g, 10, 14, c.acc);
    set(g, 11, 13, c.acc); set(g, 11, 14, c.acc); set(g, 11, 15, lightenColor(c.acc, 0.2));
  } else if (accId.includes("backpack")) {
    set(g, 10, 13, c.acc); set(g, 11, 13, c.acc); set(g, 11, 14, c.acc);
    set(g, 12, 13, darkenColor(c.acc, 0.15)); set(g, 12, 14, c.acc);
  } else if (accId.includes("shield")) {
    set(g, 11, 1, c.acc); set(g, 11, 2, lightenColor(c.acc, 0.2));
    set(g, 12, 1, c.acc); set(g, 12, 2, c.acc);
    set(g, 13, 2, darkenColor(c.acc, 0.2));
  }
}

// ─── ACCESSORIES (front layer) ───
function drawAccessoryFront(g: Grid, accId: string | null, c: Colors) {
  if (!accId) return;
  if (accId.includes("sword")) {
    set(g, 8, 14, 0xc0c0c0); set(g, 9, 14, 0xc0c0c0);
    set(g, 10, 14, 0xc0c0c0); set(g, 11, 14, 0x8d6e63);
    set(g, 12, 14, 0x5d4037);
  } else if (accId.includes("pet_cat")) {
    set(g, 18, 14, c.acc); set(g, 18, 15, c.acc);
    set(g, 19, 14, c.acc); set(g, 19, 15, darkenColor(c.acc, 0.2));
    set(g, 17, 14, c.acc); set(g, 17, 15, c.acc); // ears
    set(g, 18, 16, c.acc); // tail
  } else if (accId.includes("pet_dog")) {
    set(g, 18, 14, c.acc); set(g, 18, 15, c.acc);
    set(g, 19, 14, c.acc); set(g, 19, 15, darkenColor(c.acc, 0.2));
    set(g, 17, 13, darkenColor(c.acc, 0.2)); set(g, 17, 16, darkenColor(c.acc, 0.2)); // floppy ears
    set(g, 18, 16, c.acc); // tail
  }
}

// ─── SHADOW (row 21-22) ───
function drawShadow(g: Grid) {
  // Small shadow ellipse at feet
  fillRow(g, 21, 5, 11, -1); // -1 = special shadow marker
  fillRow(g, 22, 6, 10, -1);
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
        // Shadow pixel
        g.rect(c, r, 1, 1).fill({ color: 0x000000, alpha: 0.15 });
      } else if (color !== null) {
        g.rect(c, r, 1, 1).fill(color);
      }
    }
  }

  container.addChild(g);
}
