import type { CharacterColors } from "../buildCharacterGrid";

/**
 * Draw shoes on a 32x32 grid.
 * Shoes span rows 26-29, cols 10-14 (left) and 17-21 (right).
 * Types: sneakers, boots, heels, rocket, cloud.
 */
export function drawShoes(
  grid: (number | null)[][],
  shoesId: string,
  colors: CharacterColors
): void {
  const { shoes, shoesShadow } = colors;
  const style = getShoeStyle(shoesId);

  switch (style) {
    case "boots":
      drawBoots(grid, shoes, shoesShadow);
      break;
    case "heels":
      drawHeels(grid, shoes, shoesShadow);
      break;
    case "rocket":
      drawRocketBoots(grid, shoes, shoesShadow);
      break;
    case "cloud":
      drawCloudWalkers(grid, shoes, shoesShadow);
      break;
    default:
      drawSneakers(grid, shoes, shoesShadow);
  }
}

function getShoeStyle(shoesId: string): string {
  if (shoesId.includes("boots") && !shoesId.includes("rocket")) return "boots";
  if (shoesId.includes("heels")) return "heels";
  if (shoesId.includes("rocket")) return "rocket";
  if (shoesId.includes("cloud")) return "cloud";
  return "sneakers";
}

function drawSneakers(grid: (number | null)[][], shoes: number, shadow: number) {
  // Left shoe
  fill(grid, 26, 10, 14, shoes);
  fill(grid, 27, 9, 14, shoes);
  grid[27][9] = shadow;
  // Sole
  fill(grid, 28, 9, 15, shadow);

  // Right shoe
  fill(grid, 26, 17, 21, shoes);
  fill(grid, 27, 17, 22, shoes);
  grid[27][22] = shadow;
  // Sole
  fill(grid, 28, 16, 22, shadow);
}

function drawBoots(grid: (number | null)[][], shoes: number, shadow: number) {
  // Taller than sneakers - extend up
  // Left boot
  fill(grid, 24, 11, 14, shoes);
  fill(grid, 25, 10, 14, shoes);
  fill(grid, 26, 10, 14, shoes);
  fill(grid, 27, 9, 14, shoes);
  fill(grid, 28, 9, 15, shadow);
  grid[25][10] = shadow; grid[26][10] = shadow;

  // Right boot
  fill(grid, 24, 17, 20, shoes);
  fill(grid, 25, 17, 21, shoes);
  fill(grid, 26, 17, 21, shoes);
  fill(grid, 27, 17, 22, shoes);
  fill(grid, 28, 16, 22, shadow);
  grid[25][21] = shadow; grid[26][21] = shadow;
}

function drawHeels(grid: (number | null)[][], shoes: number, shadow: number) {
  // Left heel
  fill(grid, 26, 10, 14, shoes);
  fill(grid, 27, 9, 14, shoes);
  // Heel point
  grid[28][9] = shadow;
  grid[28][10] = shadow;
  fill(grid, 28, 11, 15, shadow);
  grid[29][10] = shadow; // stiletto

  // Right heel
  fill(grid, 26, 17, 21, shoes);
  fill(grid, 27, 17, 22, shoes);
  grid[28][21] = shadow;
  grid[28][22] = shadow;
  fill(grid, 28, 16, 20, shadow);
  grid[29][21] = shadow; // stiletto
}

function drawRocketBoots(grid: (number | null)[][], shoes: number, shadow: number) {
  const flame1 = 0xff6d00;
  const flame2 = 0xffab00;

  // Left rocket boot
  fill(grid, 25, 10, 14, shoes);
  fill(grid, 26, 10, 14, shoes);
  fill(grid, 27, 9, 15, shoes);
  grid[27][9] = shadow; grid[27][15] = shadow;
  fill(grid, 28, 9, 15, shadow);
  // Flame
  grid[29][11] = flame1; grid[29][12] = flame2; grid[29][13] = flame1;
  grid[30][12] = flame2;

  // Right rocket boot
  fill(grid, 25, 17, 21, shoes);
  fill(grid, 26, 17, 21, shoes);
  fill(grid, 27, 16, 22, shoes);
  grid[27][16] = shadow; grid[27][22] = shadow;
  fill(grid, 28, 16, 22, shadow);
  // Flame
  grid[29][18] = flame1; grid[29][19] = flame2; grid[29][20] = flame1;
  grid[30][19] = flame2;
}

function drawCloudWalkers(grid: (number | null)[][], shoes: number, shadow: number) {
  const cloud = 0xe3f2fd;
  const cloudShadow = 0xbbdefb;

  // Left cloud shoe
  fill(grid, 26, 10, 14, shoes);
  fill(grid, 27, 9, 15, shoes);
  // Cloud puff sole
  fill(grid, 28, 8, 15, cloud);
  grid[28][8] = cloudShadow; grid[28][15] = cloudShadow;
  fill(grid, 29, 9, 14, cloudShadow);

  // Right cloud shoe
  fill(grid, 26, 17, 21, shoes);
  fill(grid, 27, 16, 22, shoes);
  // Cloud puff sole
  fill(grid, 28, 16, 23, cloud);
  grid[28][16] = cloudShadow; grid[28][23] = cloudShadow;
  fill(grid, 29, 17, 22, cloudShadow);
}

function fill(grid: (number | null)[][], row: number, colStart: number, colEnd: number, color: number) {
  for (let c = colStart; c <= colEnd; c++) {
    grid[row][c] = color;
  }
}
