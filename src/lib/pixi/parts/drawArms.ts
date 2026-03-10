import type { CharacterColors } from "../buildCharacterGrid";

/**
 * Draw arms on a 32x32 grid.
 * Left arm: cols 7-9, Right arm: cols 22-24
 * Arms span rows 14-18, with hands at bottom.
 */
export function drawArms(
  grid: (number | null)[][],
  colors: CharacterColors
): void {
  const { skin, skinShadow, shirt, shirtShadow } = colors;

  // Left arm
  // Row 14: Shoulder/sleeve
  grid[14][8] = shirt; grid[14][9] = shirt;
  // Row 15: Upper arm (sleeve)
  grid[15][7] = shirt; grid[15][8] = shirtShadow; grid[15][9] = shirt;
  // Row 16: Lower sleeve
  grid[16][7] = shirtShadow; grid[16][8] = shirt; grid[16][9] = shirtShadow;
  // Row 17: Forearm (skin)
  grid[17][7] = skin; grid[17][8] = skin; grid[17][9] = skinShadow;
  // Row 18: Hand
  grid[18][7] = skin; grid[18][8] = skinShadow;

  // Right arm
  // Row 14: Shoulder/sleeve
  grid[14][22] = shirt; grid[14][23] = shirt;
  // Row 15: Upper arm (sleeve)
  grid[15][22] = shirt; grid[15][23] = shirtShadow; grid[15][24] = shirt;
  // Row 16: Lower sleeve
  grid[16][22] = shirtShadow; grid[16][23] = shirt; grid[16][24] = shirtShadow;
  // Row 17: Forearm (skin)
  grid[17][22] = skinShadow; grid[17][23] = skin; grid[17][24] = skin;
  // Row 18: Hand
  grid[18][23] = skinShadow; grid[18][24] = skin;
}
