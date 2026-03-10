import type { CharacterColors } from "../buildCharacterGrid";
import { darkenColor, lightenColor } from "../colorUtils";

/**
 * Draw hats on a 32x32 grid.
 * Hats occupy rows 0-6, replacing/overlaying hair.
 * Types: baseball, beanie, crown, wizard, santa, headphones, halo, devil, astronaut.
 */
export function drawHat(
  grid: (number | null)[][],
  hatId: string | null,
  colors: CharacterColors
): void {
  if (!hatId) return;

  const hat = colors.hat!;
  const shadow = darkenColor(hat, 0.2);
  const highlight = lightenColor(hat, 0.2);

  const style = getHatStyle(hatId);

  switch (style) {
    case "baseball":
      drawBaseballCap(grid, hat, shadow, highlight);
      break;
    case "beanie":
      drawBeanie(grid, hat, shadow, highlight);
      break;
    case "crown":
      drawCrown(grid, hat, shadow, highlight);
      break;
    case "wizard":
      drawWizardHat(grid, hat, shadow, highlight);
      break;
    case "santa":
      drawSantaHat(grid, hat, shadow);
      break;
    case "headphones":
      drawHeadphones(grid, hat, shadow);
      break;
    case "halo":
      drawHalo(grid);
      break;
    case "devil":
      drawDevilHorns(grid, hat, shadow);
      break;
    case "astronaut":
      drawAstronautHelmet(grid, hat, shadow);
      break;
    default:
      drawBaseballCap(grid, hat, shadow, highlight);
  }
}

function getHatStyle(hatId: string): string {
  if (hatId.includes("baseball")) return "baseball";
  if (hatId.includes("beanie")) return "beanie";
  if (hatId.includes("crown")) return "crown";
  if (hatId.includes("wizard")) return "wizard";
  if (hatId.includes("santa")) return "santa";
  if (hatId.includes("headphones")) return "headphones";
  if (hatId.includes("halo")) return "halo";
  if (hatId.includes("devil")) return "devil";
  if (hatId.includes("astronaut")) return "astronaut";
  return "baseball";
}

function fill(grid: (number | null)[][], row: number, colStart: number, colEnd: number, color: number) {
  for (let c = colStart; c <= colEnd; c++) {
    grid[row][c] = color;
  }
}

function drawBaseballCap(grid: (number | null)[][], hat: number, shadow: number, hl: number) {
  // Button on top
  grid[2][15] = shadow; grid[2][16] = shadow;
  // Cap dome
  fill(grid, 3, 12, 19, hat);
  fill(grid, 4, 11, 20, hat);
  grid[4][12] = hl;
  fill(grid, 5, 10, 21, hat);
  // Brim extending forward
  fill(grid, 6, 8, 22, shadow);
  fill(grid, 7, 7, 12, shadow); // brim goes left-forward
}

function drawBeanie(grid: (number | null)[][], hat: number, shadow: number, hl: number) {
  // Pompom
  grid[1][15] = hl; grid[1][16] = hl;
  grid[2][14] = hl; grid[2][15] = hat; grid[2][16] = hat; grid[2][17] = hl;
  // Dome
  fill(grid, 3, 12, 19, hat);
  grid[3][13] = hl;
  fill(grid, 4, 11, 20, hat);
  fill(grid, 5, 10, 21, hat);
  // Ribbed edge
  fill(grid, 6, 10, 21, shadow);
  for (let c = 10; c <= 21; c += 2) {
    grid[6][c] = hl;
  }
}

function drawCrown(grid: (number | null)[][], hat: number, shadow: number, hl: number) {
  const jewel = 0xe53935; // red jewel
  // Crown points
  grid[1][11] = hat; grid[1][15] = hat; grid[1][16] = hat; grid[1][20] = hat;
  grid[2][11] = hat; grid[2][12] = hat; grid[2][14] = hat; grid[2][15] = hl;
  grid[2][16] = hl; grid[2][17] = hat; grid[2][19] = hat; grid[2][20] = hat;
  fill(grid, 3, 11, 20, hat);
  // Jewels
  grid[3][13] = jewel; grid[3][16] = jewel; grid[3][19] = jewel;
  // Base band
  fill(grid, 4, 11, 20, hat);
  grid[4][12] = hl; grid[4][18] = hl;
  fill(grid, 5, 10, 21, shadow);
}

function drawWizardHat(grid: (number | null)[][], hat: number, shadow: number, hl: number) {
  const star = 0xffd700;
  // Tip
  grid[0][15] = hat; grid[0][16] = hl;
  fill(grid, 1, 14, 17, hat);
  grid[1][15] = hl;
  fill(grid, 2, 13, 18, hat);
  // Star decoration
  grid[2][15] = star; grid[2][16] = star;
  fill(grid, 3, 12, 19, hat);
  fill(grid, 4, 11, 20, hat);
  fill(grid, 5, 10, 21, hat);
  // Wide brim
  fill(grid, 6, 7, 24, shadow);
  fill(grid, 7, 8, 23, shadow);
}

function drawSantaHat(grid: (number | null)[][], hat: number, shadow: number) {
  const white = 0xf5f5f5;
  // Tip drooping right
  grid[1][20] = white;
  grid[2][19] = hat; grid[2][20] = white; grid[2][21] = white;
  fill(grid, 3, 14, 19, hat);
  grid[3][15] = shadow;
  fill(grid, 4, 12, 20, hat);
  fill(grid, 5, 11, 20, hat);
  // White fur trim
  fill(grid, 6, 10, 21, white);
  grid[6][11] = 0xe0e0e0; grid[6][20] = 0xe0e0e0;
}

function drawHeadphones(grid: (number | null)[][], hat: number, shadow: number) {
  // Headband across top
  fill(grid, 3, 12, 19, hat);
  grid[3][14] = shadow; grid[3][17] = shadow;
  fill(grid, 4, 11, 20, hat);
  // Left ear cup
  grid[6][8] = hat; grid[6][9] = hat;
  grid[7][7] = shadow; grid[7][8] = hat; grid[7][9] = hat; grid[7][10] = shadow;
  grid[8][7] = shadow; grid[8][8] = hat; grid[8][9] = hat; grid[8][10] = shadow;
  grid[9][8] = shadow; grid[9][9] = shadow;
  // Right ear cup
  grid[6][22] = hat; grid[6][23] = hat;
  grid[7][21] = shadow; grid[7][22] = hat; grid[7][23] = hat; grid[7][24] = shadow;
  grid[8][21] = shadow; grid[8][22] = hat; grid[8][23] = hat; grid[8][24] = shadow;
  grid[9][22] = shadow; grid[9][23] = shadow;
}

function drawHalo(grid: (number | null)[][]) {
  const gold = 0xffd700;
  const glow = 0xffecb3;
  // Floating ring above head
  fill(grid, 1, 12, 19, glow);
  grid[1][12] = gold; grid[1][19] = gold;
  fill(grid, 2, 11, 20, gold);
  grid[2][13] = glow; grid[2][14] = glow; grid[2][17] = glow; grid[2][18] = glow;
  fill(grid, 3, 12, 19, gold);
  grid[3][14] = glow; grid[3][17] = glow;
}

function drawDevilHorns(grid: (number | null)[][], hat: number, shadow: number) {
  // Left horn
  grid[1][10] = hat;
  grid[2][10] = hat; grid[2][11] = shadow;
  grid[3][11] = hat; grid[3][12] = shadow;
  grid[4][12] = shadow;

  // Right horn
  grid[1][21] = hat;
  grid[2][20] = shadow; grid[2][21] = hat;
  grid[3][19] = shadow; grid[3][20] = hat;
  grid[4][19] = shadow;
}

function drawAstronautHelmet(grid: (number | null)[][], hat: number, shadow: number) {
  const visor = 0x42a5f5;
  const visorGlare = 0x90caf9;
  // Helmet dome
  fill(grid, 2, 12, 19, hat);
  fill(grid, 3, 10, 21, hat);
  fill(grid, 4, 9, 22, hat);
  fill(grid, 5, 8, 23, hat);
  // Visor opening
  fill(grid, 6, 9, 22, hat);
  fill(grid, 7, 9, 22, hat);
  // Visor glass
  fill(grid, 6, 11, 20, visor);
  fill(grid, 7, 11, 20, visor);
  fill(grid, 8, 10, 21, visor);
  fill(grid, 9, 10, 21, visor);
  // Visor glare
  grid[6][12] = visorGlare; grid[6][13] = visorGlare;
  grid[7][12] = visorGlare;
  // Chin guard
  fill(grid, 10, 9, 22, hat);
  fill(grid, 11, 10, 21, shadow);
}
