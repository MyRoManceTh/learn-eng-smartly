/**
 * Pixel Art Student Character - Sprite Sheet Generator
 *
 * Generates a chibi pixel art student character sprite sheet at runtime.
 * 32×40 per frame — displayed at 96×120 CSS = 3× integer scaling.
 *
 * Animations: idle (4f), walk (8f), sit (2f), read (3f)  = 17 frames
 * Atlas: 544 × 40 px (single row)
 *
 * Supports EquippedItems via SpritePalette for dynamic colors,
 * plus hair style, hat, and accessory overlays.
 */

import type { SpritePalette } from "./spriteColors";
import { DEFAULT_PALETTE } from "./spriteColors";

export const SPRITE_FRAME_W = 32;
export const SPRITE_FRAME_H = 40;

/* ─── shorthand ──────────────────────────────────── */

function px(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  c: string,
) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}

/* ─── body-part drawers ──────────────────────────── */

function drawHair(ctx: CanvasRenderingContext2D, ox: number, oy: number, P: SpritePalette) {
  // dome
  px(ctx, ox+11, oy+0, 10, 1, P.hair);
  px(ctx, ox+10, oy+1, 12, 1, P.hair);
  px(ctx, ox+9,  oy+2, 14, 2, P.hair);
  px(ctx, ox+8,  oy+4, 16, 2, P.hair);
  // bangs
  px(ctx, ox+9,  oy+6, 14, 2, P.hair);
  // side hair (left longer)
  px(ctx, ox+8,  oy+8, 3, 6, P.hair);
  px(ctx, ox+21, oy+8, 3, 3, P.hair);
  // highlight streak
  px(ctx, ox+13, oy+2, 3, 1, P.hairHi);
  px(ctx, ox+12, oy+3, 4, 1, P.hairHi);
}

function drawFace(ctx: CanvasRenderingContext2D, ox: number, oy: number, blink: boolean, P: SpritePalette) {
  // skin base
  px(ctx, ox+10, oy+7, 12, 7, P.skin);
  px(ctx, ox+11, oy+6, 10, 1, P.skin);
  // skin shadow below hair
  px(ctx, ox+11, oy+6, 10, 1, P.skinShade);

  if (blink) {
    px(ctx, ox+12, oy+10, 3, 1, P.outline);
    px(ctx, ox+18, oy+10, 3, 1, P.outline);
  } else {
    // eye whites
    px(ctx, ox+11, oy+9,  4, 3, P.white);
    px(ctx, ox+17, oy+9,  4, 3, P.white);
    // pupils
    px(ctx, ox+13, oy+9,  2, 3, P.eyePupil);
    px(ctx, ox+19, oy+9,  2, 3, P.eyePupil);
    // shine
    px(ctx, ox+12, oy+9,  1, 1, P.eyeShine);
    px(ctx, ox+18, oy+9,  1, 1, P.eyeShine);
  }

  // blush
  px(ctx, ox+10, oy+12, 2, 1, P.blush);
  px(ctx, ox+20, oy+12, 2, 1, P.blush);

  // mouth
  px(ctx, ox+15, oy+13, 2, 1, P.mouth);
}

function drawNeck(ctx: CanvasRenderingContext2D, ox: number, oy: number, P: SpritePalette) {
  px(ctx, ox+14, oy+14, 4, 2, P.skin);
}

function drawShirt(ctx: CanvasRenderingContext2D, ox: number, oy: number, P: SpritePalette) {
  px(ctx, ox+10, oy+16, 12, 11, P.shirt);
  px(ctx, ox+11, oy+16, 10, 1, P.collar);
  px(ctx, ox+10, oy+17, 1, 5, P.shirtShade);
  px(ctx, ox+21, oy+17, 1, 5, P.shirtShade);
  px(ctx, ox+15, oy+17, 2, 1, P.tie);
  px(ctx, ox+15, oy+18, 2, 6, P.tie);
  px(ctx, ox+14, oy+24, 4, 1, P.tieDk);
}

function drawArmsIdle(ctx: CanvasRenderingContext2D, ox: number, oy: number, P: SpritePalette) {
  px(ctx, ox+7,  oy+17, 3, 8, P.shirt);
  px(ctx, ox+7,  oy+25, 3, 2, P.skin);
  px(ctx, ox+22, oy+17, 3, 8, P.shirt);
  px(ctx, ox+22, oy+25, 3, 2, P.skin);
}

function drawArmsWalk(ctx: CanvasRenderingContext2D, ox: number, oy: number, frame: number, P: SpritePalette) {
  const swingL = [0, 2, 3, 2, 0, -2, -3, -2][frame] || 0;
  const swingR = -swingL;
  px(ctx, ox+7,  oy+17+swingL, 3, 8, P.shirt);
  px(ctx, ox+7,  oy+25+swingL, 3, 2, P.skin);
  px(ctx, ox+22, oy+17+swingR, 3, 8, P.shirt);
  px(ctx, ox+22, oy+25+swingR, 3, 2, P.skin);
}

function drawArmsSitting(ctx: CanvasRenderingContext2D, ox: number, oy: number, P: SpritePalette) {
  px(ctx, ox+7,  oy+17, 3, 6, P.shirt);
  px(ctx, ox+7,  oy+23, 3, 2, P.skin);
  px(ctx, ox+22, oy+17, 3, 6, P.shirt);
  px(ctx, ox+22, oy+23, 3, 2, P.skin);
}

function drawArmsReading(ctx: CanvasRenderingContext2D, ox: number, oy: number, P: SpritePalette) {
  px(ctx, ox+7,  oy+17, 3, 4, P.shirt);
  px(ctx, ox+6,  oy+21, 3, 2, P.skin);
  px(ctx, ox+22, oy+17, 3, 4, P.shirt);
  px(ctx, ox+23, oy+21, 3, 2, P.skin);
}

function drawLegsIdle(ctx: CanvasRenderingContext2D, ox: number, oy: number, P: SpritePalette) {
  px(ctx, ox+11, oy+27, 4, 7, P.pantsN);
  px(ctx, ox+17, oy+27, 4, 7, P.pantsN);
  px(ctx, ox+11, oy+27, 1, 7, P.pantsD);
  px(ctx, ox+17, oy+27, 1, 7, P.pantsD);
}

function drawLegsWalk(ctx: CanvasRenderingContext2D, ox: number, oy: number, frame: number, P: SpritePalette) {
  const offL = [0, -1, -2, -1, 0, 1, 2, 1][frame] || 0;
  const offR = -offL;
  px(ctx, ox+11+offL, oy+27, 4, 7, P.pantsN);
  px(ctx, ox+11+offL, oy+27, 1, 7, P.pantsD);
  px(ctx, ox+17+offR, oy+27, 4, 7, P.pantsN);
  px(ctx, ox+17+offR, oy+27, 1, 7, P.pantsD);
}

function drawLegsSitting(ctx: CanvasRenderingContext2D, ox: number, oy: number, P: SpritePalette) {
  px(ctx, ox+10, oy+27, 12, 3, P.pantsN);
  px(ctx, ox+10, oy+27, 12, 1, P.pantsD);
  px(ctx, ox+11, oy+30, 4, 4, P.pantsN);
  px(ctx, ox+17, oy+30, 4, 4, P.pantsN);
}

function drawShoesIdle(ctx: CanvasRenderingContext2D, ox: number, oy: number, P: SpritePalette) {
  px(ctx, ox+10, oy+34, 5, 3, P.shoe);
  px(ctx, ox+17, oy+34, 5, 3, P.shoe);
  px(ctx, ox+10, oy+36, 5, 1, P.shoeDk);
  px(ctx, ox+17, oy+36, 5, 1, P.shoeDk);
}

function drawShoesWalk(ctx: CanvasRenderingContext2D, ox: number, oy: number, frame: number, P: SpritePalette) {
  const offL = [0, -1, -2, -1, 0, 1, 2, 1][frame] || 0;
  const offR = -offL;
  px(ctx, ox+10+offL, oy+34, 5, 3, P.shoe);
  px(ctx, ox+17+offR, oy+34, 5, 3, P.shoe);
  px(ctx, ox+10+offL, oy+36, 5, 1, P.shoeDk);
  px(ctx, ox+17+offR, oy+36, 5, 1, P.shoeDk);
}

function drawShoesSitting(ctx: CanvasRenderingContext2D, ox: number, oy: number, P: SpritePalette) {
  px(ctx, ox+11, oy+34, 4, 3, P.shoe);
  px(ctx, ox+17, oy+34, 4, 3, P.shoe);
  px(ctx, ox+11, oy+36, 4, 1, P.shoeDk);
  px(ctx, ox+17, oy+36, 4, 1, P.shoeDk);
}

function drawBook(ctx: CanvasRenderingContext2D, ox: number, oy: number, P: SpritePalette) {
  px(ctx, ox+5,  oy+22, 8, 6, P.book);
  px(ctx, ox+6,  oy+23, 6, 4, P.bookPage);
  px(ctx, ox+9,  oy+22, 1, 6, P.tieDk);
  px(ctx, ox+6,  oy+24, 2, 1, P.outline);
  px(ctx, ox+6,  oy+26, 3, 1, P.outline);
}

function drawShadow(ctx: CanvasRenderingContext2D, ox: number, oy: number, wide: boolean, P: SpritePalette) {
  const w = wide ? 18 : 14;
  const x = ox + (32 - w) / 2;
  px(ctx, x, oy+38, w, 2, P.shadow);
}

/* ─── equipment overlays ─────────────────────────── */

/**
 * Hair style overlays — drawn OVER the default hair.
 * Adapts pixel data from parts/drawHair.ts (32×32 grid)
 * to the sprite sheet coordinate system (32×40, head at oy+0).
 *
 * Maps avatarItems svgProps.path → sprite overlay.
 */
function drawEquipHair(
  ctx: CanvasRenderingContext2D,
  ox: number, oy: number,
  hairStyle: string,
  P: SpritePalette,
  hasHat: boolean,
) {
  if (hasHat) return; // hat overrides hair

  switch (hairStyle) {
    case "softbob":
      // Default — already drawn by drawHair()
      break;

    case "silkylong":
      // Long hair with side curtains
      drawHair(ctx, ox, oy, P); // base
      // Side curtains going down
      px(ctx, ox+8, oy+8, 2, 5, P.hair);
      px(ctx, ox+22, oy+8, 2, 5, P.hair);
      break;

    case "twintails":
      // Twin tails hanging down on both sides
      drawHair(ctx, ox, oy, P); // base
      // Left twin tail
      px(ctx, ox+7, oy+8, 2, 8, P.hair);
      px(ctx, ox+6, oy+10, 2, 4, P.hair);
      px(ctx, ox+7, oy+9, 1, 1, P.hairHi);
      // Right twin tail
      px(ctx, ox+23, oy+8, 2, 8, P.hair);
      px(ctx, ox+24, oy+10, 2, 4, P.hair);
      px(ctx, ox+23, oy+9, 1, 1, P.hairHi);
      break;

    case "wavy":
      // Wavy/curly — wider dome + wavy sides
      px(ctx, ox+10, oy+0, 12, 1, P.hair);
      px(ctx, ox+9,  oy+1, 14, 1, P.hair);
      px(ctx, ox+8,  oy+2, 16, 2, P.hair);
      px(ctx, ox+7,  oy+4, 18, 2, P.hair);
      px(ctx, ox+7,  oy+6, 18, 2, P.hair);
      // highlight
      px(ctx, ox+12, oy+2, 4, 1, P.hairHi);
      px(ctx, ox+11, oy+3, 3, 1, P.hairHi);
      px(ctx, ox+20, oy+3, 2, 1, P.hairHi);
      // wavy sides
      px(ctx, ox+7, oy+8, 3, 2, P.hair);
      px(ctx, ox+6, oy+10, 2, 3, P.hair);
      px(ctx, ox+7, oy+13, 2, 2, P.hair);
      px(ctx, ox+22, oy+8, 3, 2, P.hair);
      px(ctx, ox+24, oy+10, 2, 3, P.hair);
      px(ctx, ox+23, oy+13, 2, 2, P.hair);
      break;

    case "messy":
      // Messy cute — spiky random tufts
      px(ctx, ox+12, oy+0, 8, 1, P.hair);
      px(ctx, ox+10, oy+1, 12, 1, P.hair);
      px(ctx, ox+9,  oy+2, 14, 2, P.hair);
      px(ctx, ox+8,  oy+4, 16, 2, P.hair);
      px(ctx, ox+9,  oy+6, 14, 2, P.hair);
      // messy tufts
      px(ctx, ox+9, oy+0, 2, 1, P.hair);  // left tuft
      px(ctx, ox+21, oy+0, 2, 1, P.hair); // right tuft
      px(ctx, ox+15, oy-1, 2, 1, P.hair); // top tuft (above dome!)
      // highlights
      px(ctx, ox+13, oy+2, 3, 1, P.hairHi);
      px(ctx, ox+18, oy+3, 2, 1, P.hairHi);
      // sides
      px(ctx, ox+8, oy+8, 3, 4, P.hair);
      px(ctx, ox+21, oy+8, 3, 3, P.hair);
      break;

    case "highpony":
      // High ponytail on the right
      drawHair(ctx, ox, oy, P); // base
      // Ponytail going right-side
      px(ctx, ox+22, oy+3, 2, 2, P.hair);
      px(ctx, ox+23, oy+5, 2, 2, P.hair);
      px(ctx, ox+24, oy+7, 2, 4, P.hair);
      px(ctx, ox+24, oy+11, 2, 3, P.hair);
      px(ctx, ox+22, oy+4, 1, 1, P.hairHi); // tie highlight
      break;

    case "spacebuns":
      // Two buns on top
      drawHair(ctx, ox, oy, P); // base
      // Left bun
      px(ctx, ox+8, oy-1, 4, 3, P.hair);
      px(ctx, ox+9, oy-2, 2, 1, P.hair);
      px(ctx, ox+9, oy-1, 1, 1, P.hairHi);
      // Right bun
      px(ctx, ox+20, oy-1, 4, 3, P.hair);
      px(ctx, ox+21, oy-2, 2, 1, P.hair);
      px(ctx, ox+21, oy-1, 1, 1, P.hairHi);
      break;

    case "fluffy":
      // Big fluffy cloud hair (like afro but softer)
      px(ctx, ox+10, oy-1, 12, 1, P.hair);
      px(ctx, ox+8,  oy+0, 16, 1, P.hair);
      px(ctx, ox+7,  oy+1, 18, 1, P.hair);
      px(ctx, ox+7,  oy+2, 18, 2, P.hair);
      px(ctx, ox+7,  oy+4, 18, 2, P.hair);
      px(ctx, ox+7,  oy+6, 18, 2, P.hair);
      // highlights
      px(ctx, ox+10, oy+1, 4, 1, P.hairHi);
      px(ctx, ox+9,  oy+3, 3, 1, P.hairHi);
      px(ctx, ox+22, oy+2, 2, 1, P.hairHi);
      // fluffy sides
      px(ctx, ox+6, oy+8, 4, 3, P.hair);
      px(ctx, ox+7, oy+11, 2, 2, P.hair);
      px(ctx, ox+22, oy+8, 4, 3, P.hair);
      px(ctx, ox+23, oy+11, 2, 2, P.hair);
      break;

    case "princess":
      // Long curly princess hair
      px(ctx, ox+11, oy+0, 10, 1, P.hair);
      px(ctx, ox+10, oy+1, 12, 1, P.hair);
      px(ctx, ox+9,  oy+2, 14, 2, P.hair);
      px(ctx, ox+8,  oy+4, 16, 2, P.hair);
      px(ctx, ox+9,  oy+6, 14, 2, P.hair);
      // highlight
      px(ctx, ox+13, oy+2, 3, 1, P.hairHi);
      px(ctx, ox+12, oy+3, 4, 1, P.hairHi);
      // long wavy sides
      px(ctx, ox+7, oy+8, 3, 2, P.hair);
      px(ctx, ox+6, oy+10, 3, 3, P.hair);
      px(ctx, ox+7, oy+13, 2, 4, P.hair);
      px(ctx, ox+6, oy+17, 2, 3, P.hair);
      px(ctx, ox+22, oy+8, 3, 2, P.hair);
      px(ctx, ox+23, oy+10, 3, 3, P.hair);
      px(ctx, ox+23, oy+13, 2, 4, P.hair);
      px(ctx, ox+24, oy+17, 2, 3, P.hair);
      // curl tips
      px(ctx, ox+5, oy+19, 2, 1, P.hairHi);
      px(ctx, ox+25, oy+19, 2, 1, P.hairHi);
      break;

    case "electrichawk":
      // Tall mohawk/spiky electric style
      // Tall spike center
      px(ctx, ox+14, oy-3, 4, 1, P.hair);
      px(ctx, ox+13, oy-2, 6, 1, P.hair);
      px(ctx, ox+12, oy-1, 8, 1, P.hair);
      px(ctx, ox+11, oy+0, 10, 1, P.hair);
      px(ctx, ox+10, oy+1, 12, 1, P.hair);
      px(ctx, ox+9,  oy+2, 14, 2, P.hair);
      px(ctx, ox+8,  oy+4, 16, 2, P.hair);
      px(ctx, ox+9,  oy+6, 14, 2, P.hair);
      // highlights on spike
      px(ctx, ox+15, oy-2, 2, 1, P.hairHi);
      px(ctx, ox+14, oy-1, 3, 1, P.hairHi);
      px(ctx, ox+13, oy+1, 2, 1, P.hairHi);
      // shaved sides (thin)
      px(ctx, ox+8, oy+8, 2, 2, P.hair);
      px(ctx, ox+22, oy+8, 2, 2, P.hair);
      break;

    default:
      // Unknown style — use default hair
      break;
  }
}

/**
 * Hat overlays — drawn OVER hair, adapting from parts/drawHat.ts.
 * Sprite sheet head starts at oy+0, so grid row N maps to oy+N.
 */
function drawEquipHat(
  ctx: CanvasRenderingContext2D,
  ox: number, oy: number,
  hatId: string,
  hatColor: string,
  P: SpritePalette,
) {
  const shadow = darkenHex(hatColor, 0.2);
  const highlight = lightenHex(hatColor, 0.2);
  const style = getHatStyleFromId(hatId);

  switch (style) {
    case "baseball":
      px(ctx, ox+15, oy+2, 2, 1, shadow);
      px(ctx, ox+12, oy+3, 8, 1, hatColor);
      px(ctx, ox+11, oy+4, 10, 1, hatColor);
      px(ctx, ox+12, oy+4, 1, 1, highlight);
      px(ctx, ox+10, oy+5, 12, 1, hatColor);
      px(ctx, ox+8,  oy+6, 15, 1, shadow);
      px(ctx, ox+7,  oy+7, 6, 1, shadow);
      break;

    case "beanie":
      px(ctx, ox+15, oy+1, 2, 1, highlight);
      px(ctx, ox+14, oy+2, 4, 1, hatColor);
      px(ctx, ox+14, oy+2, 1, 1, highlight);
      px(ctx, ox+17, oy+2, 1, 1, highlight);
      px(ctx, ox+12, oy+3, 8, 1, hatColor);
      px(ctx, ox+13, oy+3, 1, 1, highlight);
      px(ctx, ox+11, oy+4, 10, 1, hatColor);
      px(ctx, ox+10, oy+5, 12, 1, hatColor);
      // ribbed edge
      px(ctx, ox+10, oy+6, 12, 1, shadow);
      for (let c = 10; c <= 21; c += 2) {
        px(ctx, ox+c, oy+6, 1, 1, highlight);
      }
      break;

    case "crown":
      px(ctx, ox+11, oy+1, 1, 1, hatColor);
      px(ctx, ox+15, oy+1, 2, 1, hatColor);
      px(ctx, ox+20, oy+1, 1, 1, hatColor);
      px(ctx, ox+11, oy+2, 2, 1, hatColor);
      px(ctx, ox+14, oy+2, 4, 1, hatColor);
      px(ctx, ox+15, oy+2, 2, 1, highlight);
      px(ctx, ox+19, oy+2, 2, 1, hatColor);
      px(ctx, ox+11, oy+3, 10, 1, hatColor);
      // jewels
      px(ctx, ox+13, oy+3, 1, 1, "#e53935");
      px(ctx, ox+16, oy+3, 1, 1, "#e53935");
      px(ctx, ox+19, oy+3, 1, 1, "#e53935");
      px(ctx, ox+11, oy+4, 10, 1, hatColor);
      px(ctx, ox+12, oy+4, 1, 1, highlight);
      px(ctx, ox+18, oy+4, 1, 1, highlight);
      px(ctx, ox+10, oy+5, 12, 1, shadow);
      break;

    case "wizard":
      px(ctx, ox+15, oy-2, 2, 1, hatColor);
      px(ctx, ox+15, oy-2, 1, 1, highlight);
      px(ctx, ox+14, oy-1, 4, 1, hatColor);
      px(ctx, ox+15, oy-1, 1, 1, highlight);
      px(ctx, ox+13, oy+0, 6, 1, hatColor);
      px(ctx, ox+15, oy+0, 2, 1, "#ffd700"); // star
      px(ctx, ox+12, oy+1, 8, 1, hatColor);
      px(ctx, ox+11, oy+2, 10, 1, hatColor);
      px(ctx, ox+10, oy+3, 12, 1, hatColor);
      px(ctx, ox+7,  oy+4, 18, 1, shadow); // wide brim
      px(ctx, ox+8,  oy+5, 16, 1, shadow);
      break;

    case "santa":
      px(ctx, ox+20, oy-1, 1, 1, "#f5f5f5"); // pompom
      px(ctx, ox+19, oy+0, 1, 1, hatColor);
      px(ctx, ox+20, oy+0, 2, 1, "#f5f5f5");
      px(ctx, ox+14, oy+1, 6, 1, hatColor);
      px(ctx, ox+15, oy+1, 1, 1, shadow);
      px(ctx, ox+12, oy+2, 9, 1, hatColor);
      px(ctx, ox+11, oy+3, 10, 1, hatColor);
      px(ctx, ox+10, oy+4, 12, 1, "#f5f5f5"); // white fur trim
      px(ctx, ox+11, oy+4, 1, 1, "#e0e0e0");
      px(ctx, ox+20, oy+4, 1, 1, "#e0e0e0");
      break;

    case "headphones":
      px(ctx, ox+12, oy+3, 8, 1, hatColor);
      px(ctx, ox+14, oy+3, 1, 1, shadow);
      px(ctx, ox+17, oy+3, 1, 1, shadow);
      px(ctx, ox+11, oy+4, 10, 1, hatColor);
      // left ear cup
      px(ctx, ox+8,  oy+6, 2, 1, hatColor);
      px(ctx, ox+7,  oy+7, 4, 1, hatColor);
      px(ctx, ox+7,  oy+7, 1, 1, shadow);
      px(ctx, ox+10, oy+7, 1, 1, shadow);
      px(ctx, ox+7,  oy+8, 4, 1, hatColor);
      px(ctx, ox+7,  oy+8, 1, 1, shadow);
      px(ctx, ox+10, oy+8, 1, 1, shadow);
      px(ctx, ox+8,  oy+9, 2, 1, shadow);
      // right ear cup
      px(ctx, ox+22, oy+6, 2, 1, hatColor);
      px(ctx, ox+21, oy+7, 4, 1, hatColor);
      px(ctx, ox+21, oy+7, 1, 1, shadow);
      px(ctx, ox+24, oy+7, 1, 1, shadow);
      px(ctx, ox+21, oy+8, 4, 1, hatColor);
      px(ctx, ox+21, oy+8, 1, 1, shadow);
      px(ctx, ox+24, oy+8, 1, 1, shadow);
      px(ctx, ox+22, oy+9, 2, 1, shadow);
      break;

    case "halo":
      px(ctx, ox+12, oy-1, 8, 1, "#ffecb3");
      px(ctx, ox+12, oy-1, 1, 1, "#ffd700");
      px(ctx, ox+19, oy-1, 1, 1, "#ffd700");
      px(ctx, ox+11, oy+0, 10, 1, "#ffd700");
      px(ctx, ox+13, oy+0, 2, 1, "#ffecb3");
      px(ctx, ox+17, oy+0, 2, 1, "#ffecb3");
      px(ctx, ox+12, oy+1, 8, 1, "#ffd700");
      px(ctx, ox+14, oy+1, 1, 1, "#ffecb3");
      px(ctx, ox+17, oy+1, 1, 1, "#ffecb3");
      break;

    case "devil":
      // Left horn
      px(ctx, ox+10, oy+1, 1, 1, hatColor);
      px(ctx, ox+10, oy+2, 1, 1, hatColor);
      px(ctx, ox+11, oy+2, 1, 1, shadow);
      px(ctx, ox+11, oy+3, 1, 1, hatColor);
      px(ctx, ox+12, oy+3, 1, 1, shadow);
      // Right horn
      px(ctx, ox+21, oy+1, 1, 1, hatColor);
      px(ctx, ox+20, oy+2, 1, 1, shadow);
      px(ctx, ox+21, oy+2, 1, 1, hatColor);
      px(ctx, ox+19, oy+3, 1, 1, shadow);
      px(ctx, ox+20, oy+3, 1, 1, hatColor);
      break;

    case "astronaut":
      px(ctx, ox+12, oy+0, 8, 1, hatColor);
      px(ctx, ox+10, oy+1, 12, 1, hatColor);
      px(ctx, ox+9,  oy+2, 14, 1, hatColor);
      px(ctx, ox+8,  oy+3, 16, 1, hatColor);
      px(ctx, ox+9,  oy+4, 14, 1, hatColor);
      px(ctx, ox+9,  oy+5, 14, 1, hatColor);
      // visor
      const visor = "#42a5f5";
      const glare = "#90caf9";
      px(ctx, ox+11, oy+4, 10, 1, visor);
      px(ctx, ox+11, oy+5, 10, 1, visor);
      px(ctx, ox+10, oy+6, 12, 2, visor);
      px(ctx, ox+12, oy+4, 2, 1, glare);
      px(ctx, ox+12, oy+5, 1, 1, glare);
      // chin
      px(ctx, ox+9,  oy+8, 14, 1, hatColor);
      px(ctx, ox+10, oy+9, 12, 1, shadow);
      break;
  }
}

/**
 * Accessory overlays (glasses, etc.) — drawn on face area.
 */
function drawEquipAccessory(
  ctx: CanvasRenderingContext2D,
  ox: number, oy: number,
  accId: string,
  accColor: string,
) {
  if (accId.includes("glasses")) {
    drawSpriteGlasses(ctx, ox, oy, accColor);
  }
  // Back-layer accessories (cape, wings, backpack) are harder to show
  // on a small 32×40 sprite — skip for now, they're visible on avatar page
}

function drawSpriteGlasses(ctx: CanvasRenderingContext2D, ox: number, oy: number, color: string) {
  const shadow = darkenHex(color, 0.2);
  // Left lens
  px(ctx, ox+11, oy+8, 1, 1, color);
  px(ctx, ox+12, oy+8, 2, 1, shadow);
  px(ctx, ox+14, oy+8, 1, 1, color);
  // Bridge
  px(ctx, ox+15, oy+8, 2, 1, color);
  // Right lens
  px(ctx, ox+17, oy+8, 1, 1, color);
  px(ctx, ox+18, oy+8, 2, 1, shadow);
  px(ctx, ox+20, oy+8, 1, 1, color);
  // Temples
  px(ctx, ox+10, oy+8, 1, 1, color);
  px(ctx, ox+21, oy+8, 1, 1, color);
}

/* ─── color helpers ──────────────────────────────── */

function darkenHex(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const f = 1 - amount;
  return "#" + [
    Math.round(r * f).toString(16).padStart(2, "0"),
    Math.round(g * f).toString(16).padStart(2, "0"),
    Math.round(b * f).toString(16).padStart(2, "0"),
  ].join("");
}

function lightenHex(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return "#" + [
    Math.min(255, Math.round(r + (255 - r) * amount)).toString(16).padStart(2, "0"),
    Math.min(255, Math.round(g + (255 - g) * amount)).toString(16).padStart(2, "0"),
    Math.min(255, Math.round(b + (255 - b) * amount)).toString(16).padStart(2, "0"),
  ].join("");
}

function getHatStyleFromId(hatId: string): string {
  if (hatId.includes("baseball")) return "baseball";
  if (hatId.includes("beanie")) return "beanie";
  if (hatId.includes("crown")) return "crown";
  if (hatId.includes("wizard")) return "wizard";
  if (hatId.includes("santa")) return "santa";
  if (hatId.includes("headphones")) return "headphones";
  if (hatId.includes("halo")) return "halo";
  if (hatId.includes("devil")) return "devil";
  if (hatId.includes("astronaut")) return "astronaut";
  return "baseball";
}

/* ─── frame composers ────────────────────────────── */

/** Equipment overlay info passed to frame composers */
export interface EquipmentOverlay {
  hairStyle: string | null;
  hatId: string | null;
  hatColor: string;
  accessoryId: string | null;
  accessoryColor: string;
}

function drawEquipOverlays(
  ctx: CanvasRenderingContext2D,
  ox: number, oy: number,
  equip: EquipmentOverlay | null,
  P: SpritePalette,
) {
  if (!equip) return;

  // Hair style overlay (unless hat is equipped)
  if (equip.hairStyle && equip.hairStyle !== "softbob") {
    drawEquipHair(ctx, ox, oy, equip.hairStyle, P, !!equip.hatId);
  }

  // Hat overlay
  if (equip.hatId) {
    drawEquipHat(ctx, ox, oy, equip.hatId, equip.hatColor, P);
  }

  // Accessory overlay
  if (equip.accessoryId) {
    drawEquipAccessory(ctx, ox, oy, equip.accessoryId, equip.accessoryColor);
  }
}

function drawIdleFrame(ctx: CanvasRenderingContext2D, ox: number, frameIdx: number, P: SpritePalette, equip: EquipmentOverlay | null) {
  const bob = [0, -1, 0, 1][frameIdx] || 0;
  const blink = frameIdx === 2;
  drawShadow(ctx, ox, 0, false, P);
  drawShoesIdle(ctx, ox, bob, P);
  drawLegsIdle(ctx, ox, bob, P);
  drawShirt(ctx, ox, bob, P);
  drawArmsIdle(ctx, ox, bob, P);
  drawNeck(ctx, ox, bob, P);
  drawFace(ctx, ox, bob, blink, P);
  if (!equip?.hairStyle || equip.hairStyle === "softbob") {
    drawHair(ctx, ox, bob, P);
  }
  drawEquipOverlays(ctx, ox, bob, equip, P);
}

function drawWalkFrame(ctx: CanvasRenderingContext2D, ox: number, frameIdx: number, P: SpritePalette, equip: EquipmentOverlay | null) {
  const bob = [0, -1, -1, 0, 0, -1, -1, 0][frameIdx] || 0;
  drawShadow(ctx, ox, 0, false, P);
  drawShoesWalk(ctx, ox, bob, frameIdx, P);
  drawLegsWalk(ctx, ox, bob, frameIdx, P);
  drawShirt(ctx, ox, bob, P);
  drawArmsWalk(ctx, ox, bob, frameIdx, P);
  drawNeck(ctx, ox, bob, P);
  drawFace(ctx, ox, bob, false, P);
  if (!equip?.hairStyle || equip.hairStyle === "softbob") {
    drawHair(ctx, ox, bob, P);
  }
  drawEquipOverlays(ctx, ox, bob, equip, P);
}

function drawSitFrame(ctx: CanvasRenderingContext2D, ox: number, frameIdx: number, P: SpritePalette, equip: EquipmentOverlay | null) {
  const bob = frameIdx === 1 ? -1 : 0;
  const sitOffset = 4;
  drawShadow(ctx, ox, 0, true, P);
  drawShoesSitting(ctx, ox, sitOffset, P);
  drawLegsSitting(ctx, ox, sitOffset, P);
  drawShirt(ctx, ox, sitOffset + bob, P);
  drawArmsSitting(ctx, ox, sitOffset + bob, P);
  drawNeck(ctx, ox, sitOffset + bob, P);
  drawFace(ctx, ox, sitOffset + bob, false, P);
  if (!equip?.hairStyle || equip.hairStyle === "softbob") {
    drawHair(ctx, ox, sitOffset + bob, P);
  }
  drawEquipOverlays(ctx, ox, sitOffset + bob, equip, P);
}

function drawReadFrame(ctx: CanvasRenderingContext2D, ox: number, frameIdx: number, P: SpritePalette, equip: EquipmentOverlay | null) {
  const bob = frameIdx === 1 ? -1 : 0;
  const sitOffset = 4;
  drawShadow(ctx, ox, 0, true, P);
  drawShoesSitting(ctx, ox, sitOffset, P);
  drawLegsSitting(ctx, ox, sitOffset, P);
  drawShirt(ctx, ox, sitOffset + bob, P);
  drawArmsReading(ctx, ox, sitOffset + bob, P);
  drawBook(ctx, ox, sitOffset + bob, P);
  drawNeck(ctx, ox, sitOffset + bob, P);
  drawFace(ctx, ox, sitOffset + bob, false, P);
  if (!equip?.hairStyle || equip.hairStyle === "softbob") {
    drawHair(ctx, ox, sitOffset + bob, P);
  }
  drawEquipOverlays(ctx, ox, sitOffset + bob, equip, P);
}

/* ─── public API ─────────────────────────────────── */

export interface SpriteSheetData {
  canvas: HTMLCanvasElement;
  animations: Record<string, { startFrame: number; frameCount: number }>;
  frameWidth: number;
  frameHeight: number;
}

/**
 * Generate a complete pixel art student sprite sheet canvas.
 * Returns the canvas + animation metadata.
 *
 * @param palette  Optional SpritePalette for custom colors (default = school uniform)
 * @param equip    Optional equipment overlays (hair/hat/accessory)
 */
export function generateStudentSpriteSheet(
  palette?: SpritePalette,
  equip?: EquipmentOverlay | null,
): SpriteSheetData {
  const P = palette || DEFAULT_PALETTE;
  const eq = equip ?? null;

  const animations = {
    idle:    { startFrame: 0,  frameCount: 4 },
    walk:    { startFrame: 4,  frameCount: 8 },
    sit:     { startFrame: 12, frameCount: 2 },
    read:    { startFrame: 14, frameCount: 3 },
  };

  const totalFrames = 17;
  const canvas = document.createElement("canvas");
  canvas.width = totalFrames * SPRITE_FRAME_W;
  canvas.height = SPRITE_FRAME_H;

  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw idle frames (0-3)
  for (let i = 0; i < 4; i++) {
    drawIdleFrame(ctx, i * SPRITE_FRAME_W, i, P, eq);
  }

  // Draw walk frames (4-11)
  for (let i = 0; i < 8; i++) {
    drawWalkFrame(ctx, (4 + i) * SPRITE_FRAME_W, i, P, eq);
  }

  // Draw sit frames (12-13)
  for (let i = 0; i < 2; i++) {
    drawSitFrame(ctx, (12 + i) * SPRITE_FRAME_W, i, P, eq);
  }

  // Draw read frames (14-16)
  for (let i = 0; i < 3; i++) {
    drawReadFrame(ctx, (14 + i) * SPRITE_FRAME_W, i, P, eq);
  }

  return {
    canvas,
    animations,
    frameWidth: SPRITE_FRAME_W,
    frameHeight: SPRITE_FRAME_H,
  };
}
