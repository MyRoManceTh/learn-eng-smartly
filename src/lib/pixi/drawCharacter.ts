import { Container, Graphics } from "pixi.js";
import { EquippedItems } from "@/types/avatar";
import { buildCharacterGrid, GRID_SIZE } from "./buildCharacterGrid";

/**
 * Draw a pixel art character onto a PixiJS Container.
 * Clears existing children and redraws from the 32x32 grid.
 */
export function drawPixelCharacter(
  container: Container,
  equipped: EquippedItems,
  pixelSize: number
): void {
  container.removeChildren();

  const grid = buildCharacterGrid(equipped);
  const g = new Graphics();

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const color = grid[row][col];
      if (color !== null) {
        // Ground shadow pixels get alpha
        if (row >= 30 && color === 0x000000) {
          g.rect(col * pixelSize, row * pixelSize, pixelSize, pixelSize)
            .fill({ color: 0x000000, alpha: 0.15 });
        } else {
          g.rect(col * pixelSize, row * pixelSize, pixelSize, pixelSize)
            .fill(color);
        }
      }
    }
  }

  container.addChild(g);
}
