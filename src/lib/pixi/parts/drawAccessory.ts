import type { CharacterColors } from "../buildCharacterGrid";
import { darkenColor, lightenColor } from "../colorUtils";

/**
 * Draw accessories on a 32x32 grid.
 * Types: glasses, backpack, wings, cape, pet_cat, pet_dog, sword, shield.
 * Some go behind the character (wings, cape, backpack) - drawn as "back" layer.
 * Some go in front (glasses) - drawn as "front" layer.
 */
export function drawAccessoryBack(
  grid: (number | null)[][],
  accId: string | null,
  accColor: number
): void {
  if (!accId) return;

  const shadow = darkenColor(accColor, 0.2);

  if (accId.includes("cape")) {
    drawCape(grid, accColor, shadow);
  } else if (accId.includes("wings")) {
    drawWings(grid, accColor, shadow);
  } else if (accId.includes("backpack")) {
    drawBackpack(grid, accColor, shadow);
  } else if (accId.includes("shield")) {
    drawShield(grid, accColor, shadow);
  }
}

export function drawAccessoryFront(
  grid: (number | null)[][],
  accId: string | null,
  accColor: number
): void {
  if (!accId) return;

  const shadow = darkenColor(accColor, 0.2);

  if (accId.includes("glasses")) {
    drawGlasses(grid, accColor, shadow);
  } else if (accId.includes("sword")) {
    drawSword(grid, accColor, shadow);
  } else if (accId.includes("pet_cat")) {
    drawPetCat(grid);
  } else if (accId.includes("pet_dog")) {
    drawPetDog(grid);
  }
}

function drawGlasses(grid: (number | null)[][], color: number, shadow: number) {
  // Glasses overlay on face row 8
  // Left lens frame
  grid[8][11] = color;
  grid[8][12] = shadow; // around left eye
  grid[8][13] = shadow;
  grid[8][14] = color;
  // Bridge
  grid[8][15] = color;
  grid[8][16] = color;
  // Right lens frame
  grid[8][17] = color;
  grid[8][18] = shadow;
  grid[8][19] = shadow;
  grid[8][20] = color;
  // Temples (arms going to ears)
  grid[8][10] = color;
  grid[8][21] = color;
}

function drawCape(grid: (number | null)[][], color: number, shadow: number) {
  // Cape billowing behind, visible on sides
  // Left side
  grid[14][7] = color;
  grid[15][6] = color; grid[15][7] = color;
  grid[16][5] = shadow; grid[16][6] = color; grid[16][7] = color;
  grid[17][5] = shadow; grid[17][6] = color;
  grid[18][5] = color; grid[18][6] = shadow;
  grid[19][5] = color; grid[19][6] = shadow;
  grid[20][6] = shadow;

  // Right side
  grid[14][24] = color;
  grid[15][24] = color; grid[15][25] = color;
  grid[16][24] = color; grid[16][25] = color; grid[16][26] = shadow;
  grid[17][25] = color; grid[17][26] = shadow;
  grid[18][25] = shadow; grid[18][26] = color;
  grid[19][25] = shadow; grid[19][26] = color;
  grid[20][25] = shadow;
}

function drawWings(grid: (number | null)[][], color: number, shadow: number) {
  const hl = lightenColor(color, 0.3);

  // Left wing
  grid[13][5] = hl; grid[13][6] = color;
  grid[14][3] = hl; grid[14][4] = color; grid[14][5] = color; grid[14][6] = shadow;
  grid[15][2] = hl; grid[15][3] = color; grid[15][4] = color; grid[15][5] = shadow;
  grid[16][3] = hl; grid[16][4] = color; grid[16][5] = shadow;
  grid[17][4] = shadow; grid[17][5] = shadow;

  // Right wing
  grid[13][25] = color; grid[13][26] = hl;
  grid[14][25] = shadow; grid[14][26] = color; grid[14][27] = color; grid[14][28] = hl;
  grid[15][26] = shadow; grid[15][27] = color; grid[15][28] = color; grid[15][29] = hl;
  grid[16][26] = shadow; grid[16][27] = color; grid[16][28] = hl;
  grid[17][26] = shadow; grid[17][27] = shadow;
}

function drawBackpack(grid: (number | null)[][], color: number, shadow: number) {
  // Backpack visible on right side
  grid[14][23] = color; grid[14][24] = color;
  grid[15][23] = color; grid[15][24] = color; grid[15][25] = shadow;
  grid[16][23] = color; grid[16][24] = color; grid[16][25] = shadow;
  grid[17][23] = shadow; grid[17][24] = color; grid[17][25] = shadow;
  grid[18][23] = shadow; grid[18][24] = shadow;
  // Strap
  grid[13][22] = shadow;
  grid[14][22] = shadow;
}

function drawSword(grid: (number | null)[][], color: number, shadow: number) {
  const blade = 0xc0c0c0;
  const bladeHl = 0xe0e0e0;

  // Sword held to the right side
  // Handle (near hand)
  grid[17][25] = color; grid[17][26] = shadow;
  // Guard
  grid[16][24] = color; grid[16][25] = 0x8d6e63; grid[16][26] = 0x8d6e63; grid[16][27] = color;
  // Blade going up
  grid[15][25] = blade; grid[15][26] = bladeHl;
  grid[14][25] = blade; grid[14][26] = bladeHl;
  grid[13][25] = blade; grid[13][26] = bladeHl;
  grid[12][25] = blade; grid[12][26] = bladeHl;
  grid[11][26] = blade;
  grid[10][26] = blade;
}

function drawShield(grid: (number | null)[][], color: number, shadow: number) {
  const hl = lightenColor(color, 0.3);
  // Shield on left side
  grid[15][5] = shadow; grid[15][6] = color; grid[15][7] = color;
  grid[16][4] = shadow; grid[16][5] = color; grid[16][6] = hl; grid[16][7] = color; grid[16][8] = shadow;
  grid[17][4] = shadow; grid[17][5] = color; grid[17][6] = color; grid[17][7] = color; grid[17][8] = shadow;
  grid[18][5] = shadow; grid[18][6] = color; grid[18][7] = shadow;
  grid[19][6] = shadow;
}

function drawPetCat(grid: (number | null)[][]) {
  const body = 0xff9800;
  const dark = 0xe65100;
  // Small cat next to feet (right side)
  // Ears
  grid[25][24] = dark; grid[25][27] = dark;
  // Head
  grid[26][24] = body; grid[26][25] = body; grid[26][26] = body; grid[26][27] = body;
  grid[26][25] = 0x1a1a2e; // eye
  grid[26][26] = 0x1a1a2e; // eye
  // Body
  grid[27][24] = body; grid[27][25] = body; grid[27][26] = body; grid[27][27] = body;
  grid[28][24] = body; grid[28][25] = dark; grid[28][26] = dark; grid[28][27] = body;
  // Tail
  grid[27][28] = body; grid[26][28] = body; grid[25][28] = dark;
}

function drawPetDog(grid: (number | null)[][]) {
  const body = 0x8d6e63;
  const dark = 0x5d4037;
  // Small dog next to feet (right side)
  // Ears (floppy)
  grid[24][24] = dark; grid[24][27] = dark;
  grid[25][24] = dark; grid[25][27] = dark;
  // Head
  grid[25][25] = body; grid[25][26] = body;
  grid[26][24] = body; grid[26][25] = 0x1a1a2e; grid[26][26] = 0x1a1a2e; grid[26][27] = body;
  // Snout
  grid[27][25] = body; grid[27][26] = dark;
  // Body
  grid[27][24] = body; grid[27][27] = body;
  grid[28][24] = body; grid[28][25] = body; grid[28][26] = body; grid[28][27] = body;
  // Tail
  grid[26][28] = body; grid[25][28] = body; grid[24][28] = dark;
}
