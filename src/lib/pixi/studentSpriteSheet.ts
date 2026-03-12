/**
 * Pixel Art Student Character - Sprite Sheet Generator
 *
 * Generates a chibi pixel art student character sprite sheet at runtime.
 * 32×40 per frame — displayed at 96×120 CSS = 3× integer scaling.
 *
 * Animations: idle (4f), walk (8f), sit (2f), read (3f)  = 17 frames
 * Atlas: 544 × 40 px (single row)
 */

export const SPRITE_FRAME_W = 32;
export const SPRITE_FRAME_H = 40;

/* ─── colour palette ───────────────────────────────── */
const P = {
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

/* shorthand */
function px(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  c: string,
) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}

/* ─── body-part drawers ────────────────────────────── */

function drawHair(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
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

function drawFace(ctx: CanvasRenderingContext2D, ox: number, oy: number, blink: boolean) {
  // skin base
  px(ctx, ox+10, oy+7, 12, 7, P.skin);
  px(ctx, ox+11, oy+6, 10, 1, P.skin); // under bangs
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

function drawNeck(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
  px(ctx, ox+14, oy+14, 4, 2, P.skin);
}

function drawShirt(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
  // main shirt body
  px(ctx, ox+10, oy+16, 12, 11, P.shirt);
  // collar line
  px(ctx, ox+11, oy+16, 10, 1, P.collar);
  // shadow
  px(ctx, ox+10, oy+17, 1, 5, P.shirtShade);
  px(ctx, ox+21, oy+17, 1, 5, P.shirtShade);
  // tie
  px(ctx, ox+15, oy+17, 2, 1, P.tie);
  px(ctx, ox+15, oy+18, 2, 6, P.tie);
  px(ctx, ox+14, oy+24, 4, 1, P.tieDk); // tie tip
}

function drawArmsIdle(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
  // left arm
  px(ctx, ox+7,  oy+17, 3, 8, P.shirt);
  px(ctx, ox+7,  oy+25, 3, 2, P.skin);
  // right arm
  px(ctx, ox+22, oy+17, 3, 8, P.shirt);
  px(ctx, ox+22, oy+25, 3, 2, P.skin);
}

function drawArmsWalk(ctx: CanvasRenderingContext2D, ox: number, oy: number, frame: number) {
  // arms swing forward/backward alternately
  const swingL = [0, 2, 3, 2, 0, -2, -3, -2][frame] || 0;
  const swingR = -swingL;
  // left arm
  px(ctx, ox+7,  oy+17+swingL, 3, 8, P.shirt);
  px(ctx, ox+7,  oy+25+swingL, 3, 2, P.skin);
  // right arm
  px(ctx, ox+22, oy+17+swingR, 3, 8, P.shirt);
  px(ctx, ox+22, oy+25+swingR, 3, 2, P.skin);
}

function drawArmsSitting(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
  // arms resting on lap (shorter, wider)
  px(ctx, ox+7,  oy+17, 3, 6, P.shirt);
  px(ctx, ox+7,  oy+23, 3, 2, P.skin);
  px(ctx, ox+22, oy+17, 3, 6, P.shirt);
  px(ctx, ox+22, oy+23, 3, 2, P.skin);
}

function drawArmsReading(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
  // arms forward holding book
  px(ctx, ox+7,  oy+17, 3, 4, P.shirt);
  px(ctx, ox+6,  oy+21, 3, 2, P.skin);
  px(ctx, ox+22, oy+17, 3, 4, P.shirt);
  px(ctx, ox+23, oy+21, 3, 2, P.skin);
}

function drawLegsIdle(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
  px(ctx, ox+11, oy+27, 4, 7, P.pantsN);
  px(ctx, ox+17, oy+27, 4, 7, P.pantsN);
  // shadow
  px(ctx, ox+11, oy+27, 1, 7, P.pantsD);
  px(ctx, ox+17, oy+27, 1, 7, P.pantsD);
}

function drawLegsWalk(ctx: CanvasRenderingContext2D, ox: number, oy: number, frame: number) {
  const offL = [0, -1, -2, -1, 0, 1, 2, 1][frame] || 0;
  const offR = -offL;
  // left leg
  px(ctx, ox+11+offL, oy+27, 4, 7, P.pantsN);
  px(ctx, ox+11+offL, oy+27, 1, 7, P.pantsD);
  // right leg
  px(ctx, ox+17+offR, oy+27, 4, 7, P.pantsN);
  px(ctx, ox+17+offR, oy+27, 1, 7, P.pantsD);
}

function drawLegsSitting(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
  // legs bent forward (shorter, horizontal direction)
  px(ctx, ox+10, oy+27, 12, 3, P.pantsN);
  px(ctx, ox+10, oy+27, 12, 1, P.pantsD);
  // lower leg hanging down
  px(ctx, ox+11, oy+30, 4, 4, P.pantsN);
  px(ctx, ox+17, oy+30, 4, 4, P.pantsN);
}

function drawShoesIdle(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
  px(ctx, ox+10, oy+34, 5, 3, P.shoe);
  px(ctx, ox+17, oy+34, 5, 3, P.shoe);
  px(ctx, ox+10, oy+36, 5, 1, P.shoeDk);
  px(ctx, ox+17, oy+36, 5, 1, P.shoeDk);
}

function drawShoesWalk(ctx: CanvasRenderingContext2D, ox: number, oy: number, frame: number) {
  const offL = [0, -1, -2, -1, 0, 1, 2, 1][frame] || 0;
  const offR = -offL;
  px(ctx, ox+10+offL, oy+34, 5, 3, P.shoe);
  px(ctx, ox+17+offR, oy+34, 5, 3, P.shoe);
  px(ctx, ox+10+offL, oy+36, 5, 1, P.shoeDk);
  px(ctx, ox+17+offR, oy+36, 5, 1, P.shoeDk);
}

function drawShoesSitting(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
  px(ctx, ox+11, oy+34, 4, 3, P.shoe);
  px(ctx, ox+17, oy+34, 4, 3, P.shoe);
  px(ctx, ox+11, oy+36, 4, 1, P.shoeDk);
  px(ctx, ox+17, oy+36, 4, 1, P.shoeDk);
}

function drawBook(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
  // small open book held in front
  px(ctx, ox+5,  oy+22, 8, 6, P.book);
  px(ctx, ox+6,  oy+23, 6, 4, P.bookPage);
  // spine line
  px(ctx, ox+9,  oy+22, 1, 6, P.tieDk);
  // text lines on page
  px(ctx, ox+6,  oy+24, 2, 1, P.outline);
  px(ctx, ox+6,  oy+26, 3, 1, P.outline);
}

function drawShadow(ctx: CanvasRenderingContext2D, ox: number, oy: number, wide: boolean) {
  const w = wide ? 18 : 14;
  const x = ox + (32 - w) / 2;
  px(ctx, x, oy+38, w, 2, P.shadow);
}

/* ─── frame composers ──────────────────────────────── */

function drawIdleFrame(ctx: CanvasRenderingContext2D, ox: number, frameIdx: number) {
  const bob = [0, -1, 0, 1][frameIdx] || 0;
  const blink = frameIdx === 2;
  drawShadow(ctx, ox, 0, false);
  drawShoesIdle(ctx, ox, bob);
  drawLegsIdle(ctx, ox, bob);
  drawShirt(ctx, ox, bob);
  drawArmsIdle(ctx, ox, bob);
  drawNeck(ctx, ox, bob);
  drawFace(ctx, ox, bob, blink);
  drawHair(ctx, ox, bob);
}

function drawWalkFrame(ctx: CanvasRenderingContext2D, ox: number, frameIdx: number) {
  const bob = [0, -1, -1, 0, 0, -1, -1, 0][frameIdx] || 0;
  drawShadow(ctx, ox, 0, false);
  drawShoesWalk(ctx, ox, bob, frameIdx);
  drawLegsWalk(ctx, ox, bob, frameIdx);
  drawShirt(ctx, ox, bob);
  drawArmsWalk(ctx, ox, bob, frameIdx);
  drawNeck(ctx, ox, bob);
  drawFace(ctx, ox, bob, false);
  drawHair(ctx, ox, bob);
}

function drawSitFrame(ctx: CanvasRenderingContext2D, ox: number, frameIdx: number) {
  const bob = frameIdx === 1 ? -1 : 0;
  const sitOffset = 4; // lower body position
  drawShadow(ctx, ox, 0, true);
  drawShoesSitting(ctx, ox, sitOffset);
  drawLegsSitting(ctx, ox, sitOffset);
  drawShirt(ctx, ox, sitOffset + bob);
  drawArmsSitting(ctx, ox, sitOffset + bob);
  drawNeck(ctx, ox, sitOffset + bob);
  drawFace(ctx, ox, sitOffset + bob, false);
  drawHair(ctx, ox, sitOffset + bob);
}

function drawReadFrame(ctx: CanvasRenderingContext2D, ox: number, frameIdx: number) {
  const bob = frameIdx === 1 ? -1 : 0;
  const sitOffset = 4;
  drawShadow(ctx, ox, 0, true);
  drawShoesSitting(ctx, ox, sitOffset);
  drawLegsSitting(ctx, ox, sitOffset);
  drawShirt(ctx, ox, sitOffset + bob);
  drawArmsReading(ctx, ox, sitOffset + bob);
  drawBook(ctx, ox, sitOffset + bob);
  drawNeck(ctx, ox, sitOffset + bob);
  drawFace(ctx, ox, sitOffset + bob, false);
  drawHair(ctx, ox, sitOffset + bob);
}

/* ─── public API ───────────────────────────────────── */

export interface SpriteSheetData {
  canvas: HTMLCanvasElement;
  animations: Record<string, { startFrame: number; frameCount: number }>;
  frameWidth: number;
  frameHeight: number;
}

/**
 * Generate a complete pixel art student sprite sheet canvas.
 * Returns the canvas + animation metadata.
 */
export function generateStudentSpriteSheet(): SpriteSheetData {
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
    drawIdleFrame(ctx, i * SPRITE_FRAME_W, i);
  }

  // Draw walk frames (4-11)
  for (let i = 0; i < 8; i++) {
    drawWalkFrame(ctx, (4 + i) * SPRITE_FRAME_W, i);
  }

  // Draw sit frames (12-13)
  for (let i = 0; i < 2; i++) {
    drawSitFrame(ctx, (12 + i) * SPRITE_FRAME_W, i);
  }

  // Draw read frames (14-16)
  for (let i = 0; i < 3; i++) {
    drawReadFrame(ctx, (14 + i) * SPRITE_FRAME_W, i);
  }

  return {
    canvas,
    animations,
    frameWidth: SPRITE_FRAME_W,
    frameHeight: SPRITE_FRAME_H,
  };
}
