import type { CharacterColors } from "../buildCharacterGrid";

/**
 * Draw legs/pants on a 32x32 grid.
 * Legs span rows 20-25, cols 11-20.
 * Supports: full pants, shorts, skirt.
 */
export function drawLegs(
  grid: (number | null)[][],
  pantsId: string,
  colors: CharacterColors
): void {
  const { pants, pantsShadow, skin } = colors;
  const style = getPantsStyle(pantsId);

  switch (style) {
    case "shorts":
      drawShorts(grid, pants, pantsShadow, skin);
      break;
    case "skirt":
      drawSkirt(grid, pants, pantsShadow, skin);
      break;
    default:
      drawFullPants(grid, pants, pantsShadow);
  }
}

function getPantsStyle(pantsId: string): string {
  if (pantsId.includes("shorts")) return "shorts";
  if (pantsId.includes("skirt")) return "skirt";
  return "full";
}

function drawFullPants(grid: (number | null)[][], pants: number, shadow: number) {
  // Row 20: Hips
  fill(grid, 20, 11, 20, pants);
  // Row 21: Upper legs
  fill(grid, 21, 11, 20, pants);
  grid[21][15] = shadow; grid[21][16] = shadow; // inner seam
  // Row 22: Mid legs
  fill(grid, 22, 11, 14, pants);
  fill(grid, 22, 17, 20, pants);
  grid[22][15] = null; grid[22][16] = null; // gap between legs
  // Row 23: Lower legs
  fill(grid, 23, 11, 14, pants);
  fill(grid, 23, 17, 20, pants);
  // Row 24: Ankles
  fill(grid, 24, 11, 14, shadow);
  fill(grid, 24, 17, 20, shadow);
  // Row 25: Very bottom
  fill(grid, 25, 11, 14, shadow);
  fill(grid, 25, 17, 20, shadow);
}

function drawShorts(grid: (number | null)[][], pants: number, shadow: number, skin: number) {
  // Row 20: Hips
  fill(grid, 20, 11, 20, pants);
  // Row 21: Short legs
  fill(grid, 21, 11, 20, pants);
  grid[21][15] = shadow; grid[21][16] = shadow;
  // Row 22: Bottom of shorts + skin showing
  fill(grid, 22, 11, 14, shadow);
  fill(grid, 22, 17, 20, shadow);
  // Row 23-25: Bare legs (skin)
  fill(grid, 23, 11, 14, skin);
  fill(grid, 23, 17, 20, skin);
  fill(grid, 24, 11, 14, skin);
  fill(grid, 24, 17, 20, skin);
  fill(grid, 25, 11, 14, skin);
  fill(grid, 25, 17, 20, skin);
}

function drawSkirt(grid: (number | null)[][], pants: number, shadow: number, skin: number) {
  // Row 20: Waist
  fill(grid, 20, 11, 20, pants);
  // Row 21: Flared out
  fill(grid, 21, 10, 21, pants);
  // Row 22: Wider skirt
  fill(grid, 22, 9, 22, pants);
  grid[22][10] = shadow; grid[22][21] = shadow;
  // Row 23: Skirt hem
  fill(grid, 23, 10, 21, shadow);
  // Row 24-25: Bare legs
  fill(grid, 24, 12, 14, skin);
  fill(grid, 24, 17, 19, skin);
  fill(grid, 25, 12, 14, skin);
  fill(grid, 25, 17, 19, skin);
}

function fill(grid: (number | null)[][], row: number, colStart: number, colEnd: number, color: number) {
  for (let c = colStart; c <= colEnd; c++) {
    grid[row][c] = color;
  }
}
