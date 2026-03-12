/**
 * Sprite Palette Resolution
 *
 * Converts EquippedItems → SpritePalette (CSS color strings)
 * for use by studentSpriteSheet.ts Canvas 2D rendering.
 *
 * Reuses resolveColors() from buildCharacterGrid.ts
 * and color utilities from colorUtils.ts.
 */

import type { EquippedItems } from "@/types/avatar";
import { getItemById } from "@/data/avatarItems";
import { resolveColors } from "./buildCharacterGrid";
import { numToHex, darkenColor, parseColor } from "./colorUtils";

/** All colors used by the sprite sheet renderer (CSS hex strings) */
export interface SpritePalette {
  skin: string;
  skinShade: string;
  hair: string;
  hairHi: string;
  outline: string;
  white: string;
  eyePupil: string;
  eyeShine: string;
  blush: string;
  mouth: string;
  shirt: string;
  shirtShade: string;
  collar: string;
  tie: string;
  tieDk: string;
  pantsN: string;
  pantsD: string;
  shoe: string;
  shoeDk: string;
  book: string;
  bookPage: string;
  shadow: string;
}

/** Default palette — matches the hardcoded P in studentSpriteSheet */
export const DEFAULT_PALETTE: SpritePalette = {
  skin:       "#ffdbb5",
  skinShade:  "#e8a87c",
  hair:       "#3d2b1f",
  hairHi:     "#6b4d35",
  outline:    "#23232e",
  white:      "#ffffff",
  eyePupil:   "#23232e",
  eyeShine:   "#aaddff",
  blush:      "#ffaaaa",
  mouth:      "#d4886b",
  shirt:      "#ffffff",
  shirtShade: "#d5d5e0",
  collar:     "#4a7bd9",
  tie:        "#e74c3c",
  tieDk:      "#c0392b",
  pantsN:     "#2c3e6b",
  pantsD:     "#1a2744",
  shoe:       "#6b4d35",
  shoeDk:     "#3d2b1f",
  book:       "#e74c3c",
  bookPage:   "#fffff0",
  shadow:     "rgba(0,0,0,0.12)",
};

/**
 * Convert EquippedItems → SpritePalette.
 * Uses resolveColors() to get numeric colors, then converts to CSS hex.
 */
export function resolveSpritePalette(equipped: EquippedItems): SpritePalette {
  const c = resolveColors(equipped);

  return {
    skin:       numToHex(c.skin),
    skinShade:  numToHex(c.skinShadow),
    hair:       numToHex(c.hair),
    hairHi:     numToHex(c.hairHighlight),
    outline:    numToHex(c.outline),
    white:      numToHex(c.white),
    eyePupil:   numToHex(c.eye),
    eyeShine:   "#aaddff",
    blush:      numToHex(c.blush),
    mouth:      numToHex(darkenColor(c.skin, 0.25)),
    shirt:      numToHex(c.shirt),
    shirtShade: numToHex(c.shirtShadow),
    collar:     numToHex(darkenColor(c.shirt, 0.3)),
    tie:        "#e74c3c",
    tieDk:      "#c0392b",
    pantsN:     numToHex(c.pants),
    pantsD:     numToHex(c.pantsShadow),
    shoe:       numToHex(c.shoes),
    shoeDk:     numToHex(c.shoesShadow),
    book:       "#e74c3c",
    bookPage:   "#fffff0",
    shadow:     "rgba(0,0,0,0.12)",
  };
}

/** Get hair style path from equipped items */
export function resolveHairStyle(equipped: EquippedItems): string | null {
  const hairItem = getItemById(equipped.hair);
  return hairItem?.svgProps?.path || null;
}

/** Get hat ID if equipped */
export function resolveHatId(equipped: EquippedItems): string | null {
  return equipped.hat || null;
}

/** Get accessory ID if equipped */
export function resolveAccessoryId(equipped: EquippedItems): string | null {
  return equipped.accessory || null;
}

/** Get hat color as CSS hex string */
export function resolveHatColor(equipped: EquippedItems): string {
  const c = resolveColors(equipped);
  return c.hat ? numToHex(c.hat) : "#e53935";
}

/** Get accessory color as CSS hex string */
export function resolveAccessoryColor(equipped: EquippedItems): string {
  const accItem = equipped.accessory ? getItemById(equipped.accessory) : null;
  if (!accItem) return "#80deea";
  return numToHex(parseColor(accItem.svgProps?.color || "#80DEEA"));
}
