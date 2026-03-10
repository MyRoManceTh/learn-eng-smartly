import type { CharacterColors } from "../buildCharacterGrid";

/**
 * Draw hair on the 32x32 grid.
 * 8 styles: short, long, ponytail, bun, curly, spike, afro, mohawk
 * Hair occupies rows 2-7, with style-specific overhangs.
 */
export function drawHair(
  grid: (number | null)[][],
  style: string,
  colors: CharacterColors,
  hasHat: boolean
): void {
  if (hasHat) return; // hat replaces hair top

  const { hair, hairHighlight } = colors;

  switch (style) {
    case "short":
      drawShortHair(grid, hair, hairHighlight);
      break;
    case "long":
      drawLongHair(grid, hair, hairHighlight);
      break;
    case "ponytail":
      drawPonytailHair(grid, hair, hairHighlight);
      break;
    case "bun":
      drawBunHair(grid, hair, hairHighlight);
      break;
    case "curly":
      drawCurlyHair(grid, hair, hairHighlight);
      break;
    case "spike":
      drawSpikeHair(grid, hair, hairHighlight);
      break;
    case "afro":
      drawAfroHair(grid, hair, hairHighlight);
      break;
    case "mohawk":
      drawMohawkHair(grid, hair, hairHighlight);
      break;
    default:
      drawShortHair(grid, hair, hairHighlight);
  }
}

function fill(grid: (number | null)[][], row: number, colStart: number, colEnd: number, color: number) {
  for (let c = colStart; c <= colEnd; c++) {
    grid[row][c] = color;
  }
}

function drawShortHair(grid: (number | null)[][], hair: number, hl: number) {
  // Row 3: top
  fill(grid, 3, 13, 18, hair);
  // Row 4: wider
  fill(grid, 4, 11, 20, hair);
  grid[4][12] = hl; grid[4][13] = hl;
  // Row 5: sides over head
  fill(grid, 5, 10, 21, hair);
  grid[5][11] = hl;
  // Row 6: side tufts
  grid[6][10] = hair; grid[6][11] = hair;
  grid[6][20] = hair; grid[6][21] = hair;
  // Row 7: small sides
  grid[7][9] = hair; grid[7][10] = hair;
  grid[7][21] = hair;
}

function drawLongHair(grid: (number | null)[][], hair: number, hl: number) {
  // Taller and wider than short
  fill(grid, 3, 13, 18, hair);
  fill(grid, 4, 11, 20, hair);
  grid[4][12] = hl; grid[4][13] = hl;
  fill(grid, 5, 10, 21, hair);
  grid[5][11] = hl;
  // Side curtains going down
  grid[6][9] = hair; grid[6][10] = hair; grid[6][11] = hair;
  grid[6][20] = hair; grid[6][21] = hair; grid[6][22] = hair;
  grid[7][9] = hair; grid[7][10] = hair;
  grid[7][21] = hair; grid[7][22] = hair;
  grid[8][9] = hair; grid[8][22] = hair;
  grid[9][9] = hair; grid[9][22] = hair;
  grid[10][9] = hair; grid[10][22] = hair;
  // Long strands going further down
  grid[11][9] = hair; grid[11][22] = hair;
  grid[12][9] = hair; grid[12][22] = hair;
}

function drawPonytailHair(grid: (number | null)[][], hair: number, hl: number) {
  // Base similar to short
  fill(grid, 3, 13, 18, hair);
  fill(grid, 4, 11, 20, hair);
  grid[4][12] = hl;
  fill(grid, 5, 10, 21, hair);
  grid[6][10] = hair; grid[6][11] = hair;
  grid[6][20] = hair; grid[6][21] = hair;
  grid[7][9] = hair; grid[7][10] = hair;
  // Ponytail on right side
  grid[5][22] = hair;
  grid[6][22] = hair; grid[6][23] = hair;
  grid[7][22] = hair; grid[7][23] = hair;
  grid[8][23] = hair;
  grid[9][23] = hair;
  grid[10][23] = hair;
  // Ponytail tie
  grid[5][21] = hl;
}

function drawBunHair(grid: (number | null)[][], hair: number, hl: number) {
  // Base short style
  fill(grid, 3, 13, 18, hair);
  fill(grid, 4, 11, 20, hair);
  grid[4][12] = hl;
  fill(grid, 5, 10, 21, hair);
  grid[6][10] = hair; grid[6][11] = hair;
  grid[6][20] = hair; grid[6][21] = hair;
  grid[7][9] = hair; grid[7][10] = hair;
  // Bun on top
  fill(grid, 1, 14, 17, hair);
  fill(grid, 2, 13, 18, hair);
  grid[2][14] = hl; grid[2][15] = hl;
}

function drawCurlyHair(grid: (number | null)[][], hair: number, hl: number) {
  // Voluminous curly
  fill(grid, 3, 12, 19, hair);
  fill(grid, 4, 10, 21, hair);
  grid[4][11] = hl; grid[4][12] = hl; grid[4][19] = hl;
  fill(grid, 5, 9, 22, hair);
  grid[5][10] = hl; grid[5][21] = hl;
  // Wavy sides
  grid[6][9] = hair; grid[6][10] = hair; grid[6][11] = hair;
  grid[6][20] = hair; grid[6][21] = hair; grid[6][22] = hair;
  grid[7][8] = hair; grid[7][9] = hair; grid[7][10] = hair;
  grid[7][21] = hair; grid[7][22] = hair; grid[7][23] = hair;
  grid[8][8] = hl; grid[8][9] = hair;
  grid[8][22] = hair; grid[8][23] = hl;
  grid[9][9] = hair; grid[9][22] = hair;
}

function drawSpikeHair(grid: (number | null)[][], hair: number, hl: number) {
  // Spiky pointed top
  grid[0][14] = hair; grid[0][17] = hair;
  grid[1][13] = hair; grid[1][14] = hl; grid[1][15] = hair;
  grid[1][16] = hair; grid[1][17] = hl; grid[1][18] = hair;
  fill(grid, 2, 12, 19, hair);
  grid[2][13] = hl;
  fill(grid, 3, 11, 20, hair);
  fill(grid, 4, 10, 21, hair);
  grid[4][11] = hl;
  fill(grid, 5, 10, 21, hair);
  // Side spikes
  grid[5][9] = hair; grid[5][22] = hair;
  grid[6][9] = hair; grid[6][10] = hair;
  grid[6][21] = hair; grid[6][22] = hair;
  grid[7][9] = hair; grid[7][10] = hair;
}

function drawAfroHair(grid: (number | null)[][], hair: number, hl: number) {
  // Big round afro
  fill(grid, 1, 12, 19, hair);
  fill(grid, 2, 10, 21, hair);
  grid[2][11] = hl; grid[2][12] = hl;
  fill(grid, 3, 8, 23, hair);
  grid[3][9] = hl; grid[3][10] = hl;
  fill(grid, 4, 7, 24, hair);
  grid[4][8] = hl;
  fill(grid, 5, 7, 24, hair);
  // Side poofs
  grid[6][7] = hair; grid[6][8] = hair; grid[6][9] = hair; grid[6][10] = hair; grid[6][11] = hair;
  grid[6][20] = hair; grid[6][21] = hair; grid[6][22] = hair; grid[6][23] = hair; grid[6][24] = hair;
  grid[7][7] = hair; grid[7][8] = hair; grid[7][9] = hair;
  grid[7][22] = hair; grid[7][23] = hair; grid[7][24] = hair;
  grid[8][8] = hair; grid[8][9] = hair;
  grid[8][22] = hair; grid[8][23] = hair;
}

function drawMohawkHair(grid: (number | null)[][], hair: number, hl: number) {
  // Tall mohawk strip in center
  grid[0][15] = hair; grid[0][16] = hair;
  fill(grid, 1, 14, 17, hair);
  grid[1][15] = hl;
  fill(grid, 2, 13, 18, hair);
  grid[2][14] = hl;
  fill(grid, 3, 13, 18, hair);
  fill(grid, 4, 12, 19, hair);
  grid[4][13] = hl;
  fill(grid, 5, 11, 20, hair);
  // Shaved sides - only thin strip
  grid[6][10] = hair; grid[6][21] = hair;
  grid[7][10] = hair; grid[7][21] = hair;
}
