import type { CharacterColors } from "../buildCharacterGrid";
import { lightenColor, darkenColor } from "../colorUtils";

/**
 * Draw the torso/shirt on a 32x32 grid.
 * Torso occupies rows 13-19, cols 9-22.
 * Supports patterns: plain, stripes, hero, hoodie, tuxedo, dragon, galaxy.
 */
export function drawTorso(
  grid: (number | null)[][],
  shirtId: string,
  colors: CharacterColors
): void {
  const { shirt, shirtShadow } = colors;

  // Get pattern from shirt ID
  const pattern = getShirtPattern(shirtId);

  // Row 13: Shoulders
  fill(grid, 13, 11, 20, shirt);

  // Row 14: Upper chest (wider with arm connection area)
  fill(grid, 14, 10, 21, shirt);

  // Row 15-17: Main body
  fill(grid, 15, 10, 21, shirt);
  fill(grid, 16, 10, 21, shirt);
  fill(grid, 17, 10, 21, shirt);

  // Row 18: Lower torso
  fill(grid, 18, 11, 20, shirt);

  // Row 19: Waist/belt area
  fill(grid, 19, 12, 19, shirtShadow);

  // Apply shading (right side slightly darker)
  for (let r = 13; r <= 18; r++) {
    if (grid[r][20] === shirt) grid[r][20] = shirtShadow;
    if (grid[r][21] === shirt) grid[r][21] = shirtShadow;
  }

  // Apply pattern overlays
  applyPattern(grid, pattern, shirt, shirtShadow);
}

function getShirtPattern(shirtId: string): string {
  if (shirtId.includes("striped")) return "stripes";
  if (shirtId.includes("hoodie")) return "hoodie";
  if (shirtId.includes("superhero")) return "hero";
  if (shirtId.includes("tuxedo")) return "tuxedo";
  if (shirtId.includes("dragon")) return "dragon";
  if (shirtId.includes("galaxy")) return "galaxy";
  return "plain";
}

function applyPattern(
  grid: (number | null)[][],
  pattern: string,
  shirt: number,
  shadow: number
): void {
  switch (pattern) {
    case "stripes":
      // Horizontal stripes
      for (let c = 11; c <= 20; c++) {
        if (grid[14][c] === shirt) grid[14][c] = shadow;
        if (grid[16][c] === shirt) grid[16][c] = shadow;
        if (grid[18][c] != null) grid[18][c] = shadow;
      }
      break;

    case "hero": {
      // Star/emblem on chest
      const star = lightenColor(shirt, 0.4);
      grid[15][15] = star; grid[15][16] = star;
      grid[16][14] = star; grid[16][15] = star; grid[16][16] = star; grid[16][17] = star;
      grid[17][15] = star; grid[17][16] = star;
      break;
    }

    case "hoodie": {
      // Hood lines + front zipper
      const hoodLine = darkenColor(shirt, 0.15);
      // Collar / hood edge
      grid[13][13] = hoodLine; grid[13][14] = hoodLine;
      grid[13][17] = hoodLine; grid[13][18] = hoodLine;
      // Central zipper line
      for (let r = 14; r <= 18; r++) {
        grid[r][15] = hoodLine;
        grid[r][16] = hoodLine;
      }
      // Pocket
      grid[17][12] = hoodLine; grid[17][13] = hoodLine;
      grid[17][18] = hoodLine; grid[17][19] = hoodLine;
      break;
    }

    case "tuxedo": {
      // White shirt center + black lapels
      const lapel = darkenColor(shirt, 0.3);
      const white = 0xf0f0f0;
      // White shirt strip
      for (let r = 14; r <= 18; r++) {
        grid[r][15] = white;
        grid[r][16] = white;
      }
      // Lapels
      grid[14][13] = lapel; grid[14][14] = lapel;
      grid[14][17] = lapel; grid[14][18] = lapel;
      grid[15][12] = lapel; grid[15][13] = lapel;
      grid[15][18] = lapel; grid[15][19] = lapel;
      // Bow tie
      grid[13][15] = 0xd32f2f; grid[13][16] = 0xd32f2f;
      break;
    }

    case "dragon": {
      // Scale pattern + emblem
      const scale = lightenColor(shirt, 0.2);
      // Diamond scale pattern
      for (let r = 14; r <= 17; r++) {
        for (let c = 11; c <= 20; c++) {
          if ((r + c) % 3 === 0 && grid[r][c] === shirt) {
            grid[r][c] = scale;
          }
        }
      }
      // Dragon eye emblem
      grid[15][15] = 0xffd700; grid[15][16] = 0xffd700;
      grid[16][15] = 0xff6d00; grid[16][16] = 0xff6d00;
      break;
    }

    case "galaxy": {
      // Stars scattered
      const star1 = 0x7c4dff;
      const star2 = 0x448aff;
      const star3 = 0xffffff;
      grid[14][12] = star1; grid[14][19] = star2;
      grid[15][14] = star3; grid[15][18] = star1;
      grid[16][11] = star2; grid[16][16] = star3; grid[16][20] = star1;
      grid[17][13] = star1; grid[17][17] = star2;
      break;
    }
  }
}

function fill(grid: (number | null)[][], row: number, colStart: number, colEnd: number, color: number) {
  for (let c = colStart; c <= colEnd; c++) {
    grid[row][c] = color;
  }
}
