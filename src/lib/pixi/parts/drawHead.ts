import type { CharacterColors } from "../buildCharacterGrid";

/**
 * Draw the head on a 32x32 grid.
 * Head occupies cols 10-21, rows 5-12.
 * Face details: eyes at row 8, mouth/blush at row 10.
 */
export function drawHead(
  grid: (number | null)[][],
  colors: CharacterColors
): void {
  const { skin, skinShadow, eye, white, blush } = colors;

  // Row 5-6: Top of head (rounded)
  fillRow(grid, 5, 12, 19, skin);
  fillRow(grid, 6, 11, 20, skin);

  // Row 7: Head wider
  fillRow(grid, 7, 10, 21, skin);

  // Row 8: Eyes row
  fillRow(grid, 8, 10, 21, skin);
  // Left eye: cols 12-13
  grid[8][12] = white;
  grid[8][13] = eye;
  // Right eye: cols 18-19
  grid[8][18] = eye;
  grid[8][19] = white;

  // Row 9: Mid face
  fillRow(grid, 9, 10, 21, skin);
  // Blush spots
  grid[9][11] = blush;
  grid[9][20] = blush;

  // Row 10: Mouth
  fillRow(grid, 10, 10, 21, skin);
  // Smile: cols 14-17
  grid[10][14] = skinShadow;
  grid[10][15] = skinShadow;
  grid[10][16] = skinShadow;
  grid[10][17] = skinShadow;

  // Row 11: Chin (narrower)
  fillRow(grid, 11, 11, 20, skin);

  // Row 12: Neck
  fillRow(grid, 12, 13, 18, skin);
}

function fillRow(
  grid: (number | null)[][],
  row: number,
  colStart: number,
  colEnd: number,
  color: number
): void {
  for (let c = colStart; c <= colEnd; c++) {
    grid[row][c] = color;
  }
}
