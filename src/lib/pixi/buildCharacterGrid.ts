import { EquippedItems } from "@/types/avatar";
import { getItemById } from "@/data/avatarItems";
import { parseColor, darkenColor, lightenColor } from "./colorUtils";
import { drawHead } from "./parts/drawHead";
import { drawHair } from "./parts/drawHair";
import { drawTorso } from "./parts/drawTorso";
import { drawArms } from "./parts/drawArms";
import { drawLegs } from "./parts/drawLegs";
import { drawShoes } from "./parts/drawShoes";
import { drawAccessoryBack, drawAccessoryFront } from "./parts/drawAccessory";

export const GRID_SIZE = 32;

export interface CharacterColors {
  skin: number;
  skinShadow: number;
  hair: number;
  hairHighlight: number;
  shirt: number;
  shirtShadow: number;
  pants: number;
  pantsShadow: number;
  shoes: number;
  shoesShadow: number;
  hat: number | null;
  outline: number;
  eye: number;
  white: number;
  blush: number;
}

/** Resolve equipped item IDs → numeric colors */
export function resolveColors(equipped: EquippedItems): CharacterColors {
  const skinItem = getItemById(equipped.skin);
  const hairColorItem = getItemById(equipped.hairColor);
  const shirtItem = getItemById(equipped.shirt);
  const pantsItem = getItemById(equipped.pants);
  const shoesItem = getItemById(equipped.shoes);

  const skin = parseColor(skinItem?.svgProps?.color || "#F5D5C0");
  const hair = parseColor(hairColorItem?.svgProps?.color || "#2C2C2C");
  const shirt = parseColor(shirtItem?.svgProps?.color || "#4DB6AC");
  const pants = parseColor(pantsItem?.svgProps?.color || "#4A90E2");
  const shoes = parseColor(shoesItem?.svgProps?.color || "#F0F0F0");
  const hat = null;

  return {
    skin,
    skinShadow: darkenColor(skin, 0.15),
    hair,
    hairHighlight: lightenColor(hair, 0.15),
    shirt,
    shirtShadow: darkenColor(shirt, 0.15),
    pants,
    pantsShadow: darkenColor(pants, 0.15),
    shoes,
    shoesShadow: darkenColor(shoes, 0.2),
    hat,
    outline: 0x1a1a2e,
    eye: 0x1a1a2e,
    white: 0xffffff,
    blush: 0xffb4b4,
  };
}

/** Build a 32x32 grid of pixel colors for the character */
export function buildCharacterGrid(equipped: EquippedItems): (number | null)[][] {
  const grid: (number | null)[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(null)
  );

  const colors = resolveColors(equipped);

  const hairItem = getItemById(equipped.hair);
  const hairStyle = hairItem?.svgProps?.path || "short";
  const hasHat = false;

  const accItem = equipped.accessory ? getItemById(equipped.accessory) : null;
  const accColor = accItem ? parseColor(accItem.svgProps?.color || "#80DEEA") : 0;

  // Draw in order (back to front):
  // 1. Accessory back layer (cape, wings, backpack, shield)
  drawAccessoryBack(grid, equipped.accessory, accColor);

  // 2. Legs + Shoes (drawn first so torso overlaps properly)
  drawLegs(grid, equipped.pants, colors);
  drawShoes(grid, equipped.shoes, colors);

  // 3. Torso
  drawTorso(grid, equipped.shirt, colors);

  // 4. Arms
  drawArms(grid, colors);

  // 5. Head
  drawHead(grid, colors);

  // 6. Hair (behind hat check)
  drawHair(grid, hairStyle, colors, hasHat);

  // 7. Accessory front layer (glasses, sword, pets)
  drawAccessoryFront(grid, equipped.accessory, accColor);

  // 8. Ground shadow
  drawGroundShadow(grid);

  // 9. Auto-outline pass
  addOutline(grid, colors.outline);

  return grid;
}

/** Add a small elliptical shadow at the bottom */
function drawGroundShadow(grid: (number | null)[][]): void {
  const shadow = 0x000000;
  // Row 30-31: subtle shadow ellipse
  for (let c = 12; c <= 19; c++) {
    grid[30][c] = shadow;
  }
  for (let c = 13; c <= 18; c++) {
    grid[31][c] = shadow;
  }
}

/**
 * Auto-outline: for every filled pixel next to a null pixel,
 * add outline color in the null neighbor.
 * This gives the crisp pixel-art border look.
 */
function addOutline(grid: (number | null)[][], outlineColor: number): void {
  // Work on a snapshot so we don't outline outlines
  const snapshot = grid.map(row => [...row]);

  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (snapshot[r][c] !== null && snapshot[r][c] !== 0x000000) {
        // Check 4 cardinal neighbors
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
            if (snapshot[nr][nc] === null) {
              grid[nr][nc] = outlineColor;
            }
          }
        }
      }
    }
  }
}
