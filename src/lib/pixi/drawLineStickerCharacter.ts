/**
 * LINE Sticker-Style Chibi Character
 *
 * Vector drawing with PixiJS Graphics API — rounded shapes,
 * thick outlines, big head, expressive face.
 * Canvas: 32×42  |  Head ~55%  |  Body ~25%  |  Legs ~20%
 */
import { Container, Graphics } from "pixi.js";
import { EquippedItems } from "@/types/avatar";
import { getItemById } from "@/data/avatarItems";
import { parseColor, darkenColor, lightenColor } from "./colorUtils";

// ─── Canvas dimensions (same as pixel avatar for compatibility) ───
export const GRID_W = 32;
export const GRID_H = 42;

// ─── Layout constants ───
const CX = 16;         // center x
const HEAD_CY = 12;    // head center y
const HEAD_RX = 9;     // head radius x (slightly wide oval)
const HEAD_RY = 8.5;   // head radius y
const BODY_TOP = 21;   // body starts
const BODY_CX = CX;
const BODY_W = 10;     // body half-width
const BODY_H = 7;      // body height
const ARM_LEN = 6;
const LEG_TOP = BODY_TOP + BODY_H;
const LEG_LEN = 6;
const FOOT_R = 2.5;
const OUTLINE = 1.4;   // outline stroke width
const OUTLINE_COLOR = 0x1a1a2e;

// ─── Emotion type ───
export type StickerEmotion = "idle" | "happy" | "sad" | "surprised" | "angry" | "love";

// ─── Colors ───
interface Colors {
  skin: number;
  skinShade: number;
  hair: number;
  hairHi: number;
  hairDark: number;
  shirt: number;
  shirtShade: number;
  pants: number;
  pantsShade: number;
  shoes: number;
  shoesShade: number;
  hat: number | null;
  hatShade: number | null;
  acc: number;
  outline: number;
  eye: number;
  mouth: number;
  white: number;
  blush: number;
}

function resolveColors(equipped: EquippedItems): Colors {
  const skinItem = getItemById(equipped.skin);
  const hairColorItem = getItemById(equipped.hairColor);
  const shirtItem = getItemById(equipped.shirt);
  const pantsItem = getItemById(equipped.pants);
  const shoesItem = getItemById(equipped.shoes);
  const hatItem = equipped.hat ? getItemById(equipped.hat) : null;

  const skin = parseColor(skinItem?.svgProps?.color || "#F5D5C0");
  const hair = parseColor(hairColorItem?.svgProps?.color || "#2C2C2C");
  const shirt = parseColor(shirtItem?.svgProps?.color || "#4DB6AC");
  const pants = parseColor(pantsItem?.svgProps?.color || "#4A90E2");
  const shoes = parseColor(shoesItem?.svgProps?.color || "#F0F0F0");
  const hat = hatItem ? parseColor(hatItem.svgProps?.color || "#E53935") : null;

  return {
    skin,
    skinShade: darkenColor(skin, 0.15),
    hair,
    hairHi: lightenColor(hair, 0.25),
    hairDark: darkenColor(hair, 0.2),
    shirt,
    shirtShade: darkenColor(shirt, 0.2),
    pants,
    pantsShade: darkenColor(pants, 0.2),
    shoes,
    shoesShade: darkenColor(shoes, 0.25),
    hat,
    hatShade: hat ? darkenColor(hat, 0.2) : null,
    acc: 0x80deea,
    outline: OUTLINE_COLOR,
    eye: 0x1a1a2e,
    mouth: 0xc06060,
    white: 0xffffff,
    blush: 0xffb4b4,
  };
}

// ═══════════════════════════════════════════
// MAIN ENTRY
// ═══════════════════════════════════════════

export function drawLineStickerCharacter(
  container: Container,
  equipped: EquippedItems,
  _canvasH: number,
  emotion: StickerEmotion = "idle",
  walkFrame: number = 0,
  blinkFrame: number = 0, // 0 = open, 1 = half, 2 = closed
): void {
  container.removeChildren();

  const c = resolveColors(equipped);
  const g = new Graphics();
  container.addChild(g);

  const hairItem = getItemById(equipped.hair);
  const hairStyle = hairItem?.svgProps?.path || "short";
  const hasHat = !!equipped.hat;

  // Walk offsets
  const lOff = walkFrame === 1 ? -1.5 : walkFrame === 2 ? 1.5 : 0;
  const rOff = walkFrame === 1 ? 1.5 : walkFrame === 2 ? -1.5 : 0;

  // Draw order (back to front)
  drawShadow(g);
  drawAccessoryBack(g, equipped.accessory, c);
  drawLegs(g, c, lOff, rOff, equipped.pants);
  drawShoes(g, c, lOff, rOff, equipped.shoes);
  drawBody(g, c, equipped.shirt);
  drawArms(g, c, walkFrame);
  drawNeck(g, c);
  drawHead(g, c);
  if (!hasHat) drawHair(g, hairStyle, c);
  if (hasHat) drawHat(g, equipped.hat!, c);
  drawFace(g, c, emotion, blinkFrame, equipped.accessory);
  drawAccessoryFront(g, equipped.accessory, c);
}

// ═══════════════════════════════════════════
// SHADOW
// ═══════════════════════════════════════════

function drawShadow(g: Graphics) {
  g.ellipse(CX, 39.5, 7, 1.5).fill({ color: 0x000000, alpha: 0.12 });
}

// ═══════════════════════════════════════════
// HEAD — big round oval
// ═══════════════════════════════════════════

function drawHead(g: Graphics, c: Colors) {
  // Head fill
  g.ellipse(CX, HEAD_CY, HEAD_RX, HEAD_RY).fill(c.skin);
  // Subtle shading on right
  g.ellipse(CX + 3, HEAD_CY + 1, HEAD_RX - 2, HEAD_RY - 1).fill({ color: c.skinShade, alpha: 0.25 });
  // Head outline
  g.ellipse(CX, HEAD_CY, HEAD_RX, HEAD_RY).stroke({ color: c.outline, width: OUTLINE });
}

// ═══════════════════════════════════════════
// NECK
// ═══════════════════════════════════════════

function drawNeck(g: Graphics, c: Colors) {
  g.roundRect(CX - 2, HEAD_CY + HEAD_RY - 1, 4, 3, 1).fill(c.skin);
}

// ═══════════════════════════════════════════
// FACE — big eyes, blush, cute mouth
// ═══════════════════════════════════════════

function drawFace(
  g: Graphics,
  c: Colors,
  emotion: StickerEmotion,
  blinkFrame: number,
  accId: string | null,
) {
  const eyeY = HEAD_CY - 0.5;
  const eyeLX = CX - 4;
  const eyeRX = CX + 4;
  const eyeR = 2.2;

  // ── Eyes ──
  if (blinkFrame >= 2) {
    // Closed eyes — horizontal lines
    g.moveTo(eyeLX - eyeR, eyeY).lineTo(eyeLX + eyeR, eyeY)
      .stroke({ color: c.eye, width: 1.2 });
    g.moveTo(eyeRX - eyeR, eyeY).lineTo(eyeRX + eyeR, eyeY)
      .stroke({ color: c.eye, width: 1.2 });
  } else if (blinkFrame === 1) {
    // Half-closed — small ovals
    g.ellipse(eyeLX, eyeY, eyeR, eyeR * 0.4).fill(c.eye);
    g.ellipse(eyeRX, eyeY, eyeR, eyeR * 0.4).fill(c.eye);
  } else if (emotion === "happy" || emotion === "love") {
    // Happy eyes — upside-down U (squint)
    drawHappyEye(g, eyeLX, eyeY, eyeR, c);
    drawHappyEye(g, eyeRX, eyeY, eyeR, c);
  } else if (emotion === "surprised") {
    // Surprised — bigger circles
    const bigR = eyeR * 1.4;
    g.circle(eyeLX, eyeY, bigR).fill(c.white);
    g.circle(eyeLX, eyeY, bigR).stroke({ color: c.eye, width: 1 });
    g.circle(eyeLX - 0.6, eyeY - 0.6, bigR * 0.55).fill(c.eye);
    g.circle(eyeLX + 0.8, eyeY - 1.0, bigR * 0.2).fill(c.white);

    g.circle(eyeRX, eyeY, bigR).fill(c.white);
    g.circle(eyeRX, eyeY, bigR).stroke({ color: c.eye, width: 1 });
    g.circle(eyeRX - 0.6, eyeY - 0.6, bigR * 0.55).fill(c.eye);
    g.circle(eyeRX + 0.8, eyeY - 1.0, bigR * 0.2).fill(c.white);
  } else if (emotion === "angry") {
    // Angry — normal eyes + angry brows
    drawNormalEye(g, eyeLX, eyeY, eyeR, c);
    drawNormalEye(g, eyeRX, eyeY, eyeR, c);
    // Angry eyebrows
    g.moveTo(eyeLX - eyeR, eyeY - eyeR - 1.5)
      .lineTo(eyeLX + eyeR, eyeY - eyeR - 0.5)
      .stroke({ color: c.eye, width: 1.2 });
    g.moveTo(eyeRX + eyeR, eyeY - eyeR - 1.5)
      .lineTo(eyeRX - eyeR, eyeY - eyeR - 0.5)
      .stroke({ color: c.eye, width: 1.2 });
  } else if (emotion === "sad") {
    // Sad — droopy eyes
    drawNormalEye(g, eyeLX, eyeY, eyeR, c);
    drawNormalEye(g, eyeRX, eyeY, eyeR, c);
    // Sad eyebrows
    g.moveTo(eyeLX - eyeR, eyeY - eyeR - 0.5)
      .lineTo(eyeLX + eyeR, eyeY - eyeR - 1.5)
      .stroke({ color: c.eye, width: 1 });
    g.moveTo(eyeRX + eyeR, eyeY - eyeR - 0.5)
      .lineTo(eyeRX - eyeR, eyeY - eyeR - 1.5)
      .stroke({ color: c.eye, width: 1 });
  } else {
    // Normal idle eyes
    drawNormalEye(g, eyeLX, eyeY, eyeR, c);
    drawNormalEye(g, eyeRX, eyeY, eyeR, c);
  }

  // ── Love eyes (hearts) ──
  if (emotion === "love") {
    drawHeart(g, eyeLX, eyeY, 2.5, 0xff4081);
    drawHeart(g, eyeRX, eyeY, 2.5, 0xff4081);
  }

  // ── Blush circles ──
  const blushAlpha = emotion === "happy" || emotion === "love" ? 0.5 : 0.3;
  g.circle(CX - 6.5, HEAD_CY + 2.5, 2).fill({ color: c.blush, alpha: blushAlpha });
  g.circle(CX + 6.5, HEAD_CY + 2.5, 2).fill({ color: c.blush, alpha: blushAlpha });

  // ── Nose — tiny dot ──
  g.circle(CX, HEAD_CY + 1.5, 0.5).fill({ color: c.skinShade, alpha: 0.5 });

  // ── Mouth ──
  drawMouth(g, c, emotion);

  // ── Glasses ──
  if (accId === "acc_glasses") {
    drawGlasses(g, eyeLX, eyeRX, eyeY, eyeR, c);
  }

  // ── Sad tears ──
  if (emotion === "sad") {
    g.circle(eyeLX + 1, eyeY + eyeR + 2, 0.8).fill({ color: 0x64b5f6, alpha: 0.7 });
    g.circle(eyeRX - 1, eyeY + eyeR + 2, 0.8).fill({ color: 0x64b5f6, alpha: 0.7 });
  }

  // ── Angry flush ──
  if (emotion === "angry") {
    g.circle(CX - 6.5, HEAD_CY + 2.5, 2.2).fill({ color: 0xff5252, alpha: 0.35 });
    g.circle(CX + 6.5, HEAD_CY + 2.5, 2.2).fill({ color: 0xff5252, alpha: 0.35 });
  }
}

function drawNormalEye(g: Graphics, cx: number, cy: number, r: number, c: Colors) {
  // White
  g.circle(cx, cy, r).fill(c.white);
  // Pupil (slightly offset up-left)
  g.circle(cx - 0.3, cy - 0.2, r * 0.65).fill(c.eye);
  // Highlight
  g.circle(cx + 0.6, cy - 0.7, r * 0.28).fill(c.white);
  // Outline
  g.circle(cx, cy, r).stroke({ color: c.eye, width: 0.6 });
}

function drawHappyEye(g: Graphics, cx: number, cy: number, r: number, c: Colors) {
  // Upside-down U / arc — happy squint
  g.arc(cx, cy, r, Math.PI, 0, false)
    .stroke({ color: c.eye, width: 1.4 });
}

function drawHeart(g: Graphics, cx: number, cy: number, size: number, color: number) {
  const s = size * 0.5;
  g.moveTo(cx, cy + s * 0.6)
    .bezierCurveTo(cx - s * 1.3, cy - s * 0.4, cx - s * 0.5, cy - s * 1.4, cx, cy - s * 0.5)
    .bezierCurveTo(cx + s * 0.5, cy - s * 1.4, cx + s * 1.3, cy - s * 0.4, cx, cy + s * 0.6)
    .fill(color);
}

function drawMouth(g: Graphics, c: Colors, emotion: StickerEmotion) {
  const mx = CX;
  const my = HEAD_CY + 4;

  switch (emotion) {
    case "happy":
      // Big smile — wide arc
      g.arc(mx, my - 0.5, 3, 0.1, Math.PI - 0.1, false)
        .stroke({ color: c.mouth, width: 1 });
      break;
    case "sad":
      // Frown — upside-down arc
      g.arc(mx, my + 1.5, 2.5, Math.PI + 0.2, -0.2, false)
        .stroke({ color: c.mouth, width: 1 });
      break;
    case "surprised":
      // O mouth
      g.circle(mx, my + 0.5, 1.8).fill(c.mouth);
      g.circle(mx, my + 0.5, 1.2).fill({ color: 0x8b3a3a, alpha: 0.6 });
      break;
    case "angry":
      // Grumpy line
      g.moveTo(mx - 2, my + 0.3).lineTo(mx + 2, my - 0.3)
        .stroke({ color: c.mouth, width: 1.2 });
      break;
    case "love":
      // Cat smile :3
      g.arc(mx - 1.2, my, 1.2, 0.1, Math.PI - 0.1, false)
        .stroke({ color: c.mouth, width: 0.8 });
      g.arc(mx + 1.2, my, 1.2, 0.1, Math.PI - 0.1, false)
        .stroke({ color: c.mouth, width: 0.8 });
      break;
    default:
      // Gentle smile — small arc
      g.arc(mx, my, 2, 0.2, Math.PI - 0.2, false)
        .stroke({ color: c.mouth, width: 0.9 });
  }
}

function drawGlasses(
  g: Graphics,
  lx: number, rx: number, ey: number, er: number,
  c: Colors,
) {
  const gr = er + 1.2;
  // Frames
  g.circle(lx, ey, gr).stroke({ color: c.acc, width: 1 });
  g.circle(rx, ey, gr).stroke({ color: c.acc, width: 1 });
  // Bridge
  g.moveTo(lx + gr, ey).lineTo(rx - gr, ey).stroke({ color: c.acc, width: 0.8 });
  // Temple arms
  g.moveTo(lx - gr, ey).lineTo(lx - gr - 2, ey - 0.5).stroke({ color: c.acc, width: 0.8 });
  g.moveTo(rx + gr, ey).lineTo(rx + gr + 2, ey - 0.5).stroke({ color: c.acc, width: 0.8 });
}

// ═══════════════════════════════════════════
// HAIR — rounded shapes for each style
// ═══════════════════════════════════════════

function drawHair(g: Graphics, style: string, c: Colors) {
  switch (style) {
    case "long": drawLongHair(g, c); break;
    case "ponytail": drawPonytailHair(g, c); break;
    case "bun": drawBunHair(g, c); break;
    case "curly": drawCurlyHair(g, c); break;
    case "spike": drawSpikeHair(g, c); break;
    case "afro": drawAfroHair(g, c); break;
    case "mohawk": drawMohawkHair(g, c); break;
    default: drawShortHair(g, c);
  }
}

function drawShortHair(g: Graphics, c: Colors) {
  // Top dome covering upper head
  g.ellipse(CX, HEAD_CY - 3.5, HEAD_RX + 1, 6).fill(c.hair);
  // Side tufts
  g.ellipse(CX - 7.5, HEAD_CY - 1, 3, 4).fill(c.hair);
  g.ellipse(CX + 7.5, HEAD_CY - 1, 3, 4).fill(c.hair);
  // Highlight
  g.ellipse(CX - 2, HEAD_CY - 6, 3, 1.5).fill({ color: c.hairHi, alpha: 0.5 });
  // Outline
  g.ellipse(CX, HEAD_CY - 3.5, HEAD_RX + 1, 6).stroke({ color: c.outline, width: OUTLINE });
}

function drawLongHair(g: Graphics, c: Colors) {
  // Top dome
  g.ellipse(CX, HEAD_CY - 3.5, HEAD_RX + 1, 6).fill(c.hair);
  // Long sides flowing down
  g.roundRect(CX - HEAD_RX - 2, HEAD_CY - 2, 4, 14, 2).fill(c.hair);
  g.roundRect(CX + HEAD_RX - 2, HEAD_CY - 2, 4, 14, 2).fill(c.hair);
  // Shade on sides
  g.roundRect(CX - HEAD_RX - 2, HEAD_CY + 4, 4, 8, 2).fill({ color: c.hairDark, alpha: 0.4 });
  g.roundRect(CX + HEAD_RX - 2, HEAD_CY + 4, 4, 8, 2).fill({ color: c.hairDark, alpha: 0.4 });
  // Highlight
  g.ellipse(CX - 2, HEAD_CY - 6, 3, 1.5).fill({ color: c.hairHi, alpha: 0.5 });
  // Outline
  g.ellipse(CX, HEAD_CY - 3.5, HEAD_RX + 1, 6).stroke({ color: c.outline, width: OUTLINE });
  g.roundRect(CX - HEAD_RX - 2, HEAD_CY - 2, 4, 14, 2).stroke({ color: c.outline, width: OUTLINE * 0.7 });
  g.roundRect(CX + HEAD_RX - 2, HEAD_CY - 2, 4, 14, 2).stroke({ color: c.outline, width: OUTLINE * 0.7 });
}

function drawPonytailHair(g: Graphics, c: Colors) {
  drawShortHair(g, c);
  // Ponytail
  g.ellipse(CX + 10, HEAD_CY - 1, 2.5, 5).fill(c.hair);
  g.ellipse(CX + 10, HEAD_CY + 2, 2, 3).fill({ color: c.hairDark, alpha: 0.3 });
  // Hair tie
  g.circle(CX + 9, HEAD_CY - 4, 1.2).fill(0xe91e63);
  // Outline
  g.ellipse(CX + 10, HEAD_CY - 1, 2.5, 5).stroke({ color: c.outline, width: OUTLINE * 0.7 });
}

function drawBunHair(g: Graphics, c: Colors) {
  drawShortHair(g, c);
  // Bun on top
  g.circle(CX, HEAD_CY - 9, 3.5).fill(c.hair);
  g.circle(CX - 1, HEAD_CY - 10, 1.2).fill({ color: c.hairHi, alpha: 0.4 });
  g.circle(CX, HEAD_CY - 9, 3.5).stroke({ color: c.outline, width: OUTLINE * 0.7 });
}

function drawCurlyHair(g: Graphics, c: Colors) {
  // Fluffy curly mass
  const curls = [
    { x: CX - 6, y: HEAD_CY - 5, r: 4 },
    { x: CX, y: HEAD_CY - 7, r: 4.5 },
    { x: CX + 6, y: HEAD_CY - 5, r: 4 },
    { x: CX - 8, y: HEAD_CY, r: 3.5 },
    { x: CX + 8, y: HEAD_CY, r: 3.5 },
    { x: CX - 7, y: HEAD_CY + 4, r: 3 },
    { x: CX + 7, y: HEAD_CY + 4, r: 3 },
  ];
  // Fill all curls
  for (const curl of curls) {
    g.circle(curl.x, curl.y, curl.r).fill(c.hair);
  }
  // Highlights on top
  g.circle(CX - 2, HEAD_CY - 8, 1.5).fill({ color: c.hairHi, alpha: 0.4 });
  // Outline
  for (const curl of curls) {
    g.circle(curl.x, curl.y, curl.r).stroke({ color: c.outline, width: OUTLINE * 0.6 });
  }
}

function drawSpikeHair(g: Graphics, c: Colors) {
  // Spiky top with triangular points
  g.ellipse(CX, HEAD_CY - 3, HEAD_RX + 1, 5.5).fill(c.hair);
  // Spikes
  const spikes = [
    { x: CX - 5, tipY: HEAD_CY - 11 },
    { x: CX - 1, tipY: HEAD_CY - 13 },
    { x: CX + 3, tipY: HEAD_CY - 12 },
    { x: CX + 7, tipY: HEAD_CY - 10 },
  ];
  for (const s of spikes) {
    g.moveTo(s.x - 2, HEAD_CY - 5)
      .lineTo(s.x + 0.5, s.tipY)
      .lineTo(s.x + 3, HEAD_CY - 5)
      .fill(c.hair);
    g.moveTo(s.x - 2, HEAD_CY - 5)
      .lineTo(s.x + 0.5, s.tipY)
      .lineTo(s.x + 3, HEAD_CY - 5)
      .stroke({ color: c.outline, width: OUTLINE * 0.7 });
  }
  // Highlight
  g.ellipse(CX - 1, HEAD_CY - 9, 1.5, 1).fill({ color: c.hairHi, alpha: 0.5 });
  // Base outline
  g.ellipse(CX, HEAD_CY - 3, HEAD_RX + 1, 5.5).stroke({ color: c.outline, width: OUTLINE });
}

function drawAfroHair(g: Graphics, c: Colors) {
  // Big round afro
  g.circle(CX, HEAD_CY - 2, 13).fill(c.hair);
  // Texture bumps
  g.circle(CX - 6, HEAD_CY - 9, 2).fill({ color: c.hairHi, alpha: 0.3 });
  g.circle(CX + 4, HEAD_CY - 10, 1.5).fill({ color: c.hairHi, alpha: 0.3 });
  g.circle(CX - 3, HEAD_CY - 12, 1).fill({ color: c.hairHi, alpha: 0.3 });
  // Outline
  g.circle(CX, HEAD_CY - 2, 13).stroke({ color: c.outline, width: OUTLINE });
}

function drawMohawkHair(g: Graphics, c: Colors) {
  // Mohawk strip on top
  g.roundRect(CX - 3, HEAD_CY - 13, 6, 10, 2.5).fill(c.hair);
  // Highlight
  g.ellipse(CX, HEAD_CY - 11, 1.5, 1).fill({ color: c.hairHi, alpha: 0.5 });
  // Side shave hint
  g.ellipse(CX - 7, HEAD_CY - 1.5, 2, 3).fill({ color: c.skinShade, alpha: 0.2 });
  g.ellipse(CX + 7, HEAD_CY - 1.5, 2, 3).fill({ color: c.skinShade, alpha: 0.2 });
  // Outline
  g.roundRect(CX - 3, HEAD_CY - 13, 6, 10, 2.5).stroke({ color: c.outline, width: OUTLINE });
}

// ═══════════════════════════════════════════
// BODY — small round torso
// ═══════════════════════════════════════════

function drawBody(g: Graphics, c: Colors, shirtId: string) {
  // Torso — rounded rectangle
  g.roundRect(BODY_CX - BODY_W / 2, BODY_TOP, BODY_W, BODY_H, 3).fill(c.shirt);
  // Shading right side
  g.roundRect(BODY_CX + 1, BODY_TOP + 1, BODY_W / 2 - 1, BODY_H - 2, 2)
    .fill({ color: c.shirtShade, alpha: 0.3 });
  // Outline
  g.roundRect(BODY_CX - BODY_W / 2, BODY_TOP, BODY_W, BODY_H, 3)
    .stroke({ color: c.outline, width: OUTLINE });

  // Shirt patterns
  applyShirtPattern(g, shirtId, c);
}

function applyShirtPattern(g: Graphics, shirtId: string, c: Colors) {
  const top = BODY_TOP;
  const left = BODY_CX - BODY_W / 2 + 1;
  const right = BODY_CX + BODY_W / 2 - 1;

  if (shirtId.includes("striped")) {
    g.moveTo(left, top + 2.5).lineTo(right, top + 2.5).stroke({ color: c.shirtShade, width: 0.8 });
    g.moveTo(left, top + 4.5).lineTo(right, top + 4.5).stroke({ color: c.shirtShade, width: 0.8 });
  } else if (shirtId.includes("superhero")) {
    // Star emblem
    drawStar(g, BODY_CX, top + 3.5, 2, 0xffd700);
  } else if (shirtId.includes("hoodie")) {
    // Hood collar
    g.arc(BODY_CX, top + 0.5, 3, 0.3, Math.PI - 0.3, false)
      .stroke({ color: c.shirtShade, width: 0.8 });
    // Pocket
    g.roundRect(BODY_CX - 3, top + 4, 6, 2, 1).stroke({ color: c.shirtShade, width: 0.6 });
  } else if (shirtId.includes("tuxedo")) {
    // White shirt center
    g.roundRect(BODY_CX - 1.5, top + 0.5, 3, BODY_H - 1, 1).fill(0xf0f0f0);
    // Tie
    g.moveTo(BODY_CX, top + 0.5)
      .lineTo(BODY_CX - 1, top + 2.5)
      .lineTo(BODY_CX, top + 4.5)
      .lineTo(BODY_CX + 1, top + 2.5)
      .closePath()
      .fill(0xd32f2f);
  } else if (shirtId.includes("dragon")) {
    // Dragon emblem
    g.circle(BODY_CX, top + 3.5, 1.5).fill({ color: 0xffd700, alpha: 0.5 });
  } else if (shirtId.includes("galaxy")) {
    // Sparkle dots
    g.circle(BODY_CX - 2, top + 2, 0.5).fill(0xffffff);
    g.circle(BODY_CX + 2, top + 4, 0.4).fill(0xffffff);
    g.circle(BODY_CX + 1, top + 1.5, 0.3).fill(0x7c4dff);
  }
}

function drawStar(g: Graphics, cx: number, cy: number, r: number, color: number) {
  const points: number[] = [];
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / 5;
    points.push(cx + Math.cos(outerAngle) * r, cy + Math.sin(outerAngle) * r);
    points.push(cx + Math.cos(innerAngle) * r * 0.45, cy + Math.sin(innerAngle) * r * 0.45);
  }
  g.poly(points).fill(color);
}

// ═══════════════════════════════════════════
// ARMS — short rounded stubs
// ═══════════════════════════════════════════

function drawArms(g: Graphics, c: Colors, walkFrame: number) {
  const armY = BODY_TOP + 1;
  const armW = 3;
  const handR = 1.8;

  // Arm swing angle
  const swingL = walkFrame === 1 ? -0.3 : walkFrame === 2 ? 0.3 : 0;
  const swingR = walkFrame === 1 ? 0.3 : walkFrame === 2 ? -0.3 : 0;

  // Left arm (sleeve + hand)
  const lx = BODY_CX - BODY_W / 2 - armW + 0.5;
  const ly = armY + Math.sin(swingL) * 2;
  g.roundRect(lx, ly, armW, ARM_LEN - 1, 1.5).fill(c.shirt);
  g.roundRect(lx, ly, armW, ARM_LEN - 1, 1.5).stroke({ color: c.outline, width: OUTLINE * 0.7 });
  // Hand
  g.circle(lx + armW / 2, ly + ARM_LEN - 0.5, handR).fill(c.skin);
  g.circle(lx + armW / 2, ly + ARM_LEN - 0.5, handR).stroke({ color: c.outline, width: OUTLINE * 0.6 });

  // Right arm
  const rx = BODY_CX + BODY_W / 2 - 0.5;
  const ry = armY + Math.sin(swingR) * 2;
  g.roundRect(rx, ry, armW, ARM_LEN - 1, 1.5).fill(c.shirtShade);
  g.roundRect(rx, ry, armW, ARM_LEN - 1, 1.5).stroke({ color: c.outline, width: OUTLINE * 0.7 });
  // Hand
  g.circle(rx + armW / 2, ry + ARM_LEN - 0.5, handR).fill(c.skinShade);
  g.circle(rx + armW / 2, ry + ARM_LEN - 0.5, handR).stroke({ color: c.outline, width: OUTLINE * 0.6 });
}

// ═══════════════════════════════════════════
// LEGS — short cute legs
// ═══════════════════════════════════════════

function drawLegs(g: Graphics, c: Colors, lOff: number, rOff: number, pantsId: string) {
  const isShorts = pantsId.includes("shorts");
  const isSkirt = pantsId.includes("skirt");
  const legW = 3.5;
  const legH = isShorts ? LEG_LEN - 2 : LEG_LEN;

  if (isSkirt) {
    // Skirt — trapezoid shape
    g.moveTo(BODY_CX - BODY_W / 2, LEG_TOP)
      .lineTo(BODY_CX - BODY_W / 2 - 2, LEG_TOP + 3.5)
      .lineTo(BODY_CX + BODY_W / 2 + 2, LEG_TOP + 3.5)
      .lineTo(BODY_CX + BODY_W / 2, LEG_TOP)
      .closePath()
      .fill(c.pants);
    g.moveTo(BODY_CX - BODY_W / 2, LEG_TOP)
      .lineTo(BODY_CX - BODY_W / 2 - 2, LEG_TOP + 3.5)
      .lineTo(BODY_CX + BODY_W / 2 + 2, LEG_TOP + 3.5)
      .lineTo(BODY_CX + BODY_W / 2, LEG_TOP)
      .closePath()
      .stroke({ color: c.outline, width: OUTLINE * 0.7 });
    // Legs below skirt (skin)
    g.roundRect(CX - 3.5 + lOff, LEG_TOP + 3.5, legW, 2.5, 1).fill(c.skin);
    g.roundRect(CX + 0.5 + rOff, LEG_TOP + 3.5, legW, 2.5, 1).fill(c.skin);
  } else {
    // Left leg
    g.roundRect(CX - 3.5 + lOff, LEG_TOP, legW, legH, 1.5).fill(c.pants);
    g.roundRect(CX - 3.5 + lOff, LEG_TOP, legW, legH, 1.5)
      .stroke({ color: c.outline, width: OUTLINE * 0.7 });
    // Right leg
    g.roundRect(CX + 0.5 + rOff, LEG_TOP, legW, legH, 1.5).fill(c.pantsShade);
    g.roundRect(CX + 0.5 + rOff, LEG_TOP, legW, legH, 1.5)
      .stroke({ color: c.outline, width: OUTLINE * 0.7 });

    if (isShorts) {
      // Exposed skin below shorts
      g.roundRect(CX - 3.5 + lOff, LEG_TOP + legH, legW, 2, 1).fill(c.skin);
      g.roundRect(CX + 0.5 + rOff, LEG_TOP + legH, legW, 2, 1).fill(c.skin);
    }
  }
}

// ═══════════════════════════════════════════
// SHOES — round cute shoes
// ═══════════════════════════════════════════

function drawShoes(g: Graphics, c: Colors, lOff: number, rOff: number, shoesId: string) {
  const shoeY = LEG_TOP + LEG_LEN - 0.5;
  const shoeW = 4.5;
  const shoeH = 2.5;

  const isRocket = shoesId.includes("rocket");
  const isBoots = shoesId.includes("boots") && !isRocket;
  const isHeels = shoesId.includes("heels");

  // Left shoe
  g.roundRect(CX - 4.5 + lOff, shoeY, shoeW, shoeH, 1.2).fill(c.shoes);
  g.roundRect(CX - 4.5 + lOff, shoeY, shoeW, shoeH, 1.2)
    .stroke({ color: c.outline, width: OUTLINE * 0.6 });
  // Right shoe
  g.roundRect(CX + 0.5 + rOff, shoeY, shoeW, shoeH, 1.2).fill(c.shoesShade);
  g.roundRect(CX + 0.5 + rOff, shoeY, shoeW, shoeH, 1.2)
    .stroke({ color: c.outline, width: OUTLINE * 0.6 });

  if (isRocket) {
    // Rocket flame
    g.ellipse(CX - 2.5 + lOff, shoeY + shoeH + 1, 1.5, 1).fill(0xff6d00);
    g.ellipse(CX + 2.5 + rOff, shoeY + shoeH + 1, 1.5, 1).fill(0xff6d00);
    g.ellipse(CX - 2.5 + lOff, shoeY + shoeH + 1, 0.8, 0.6).fill(0xffab00);
    g.ellipse(CX + 2.5 + rOff, shoeY + shoeH + 1, 0.8, 0.6).fill(0xffab00);
  } else if (isBoots) {
    // Taller boots
    g.roundRect(CX - 4 + lOff, shoeY - 2, shoeW - 0.5, 2, 1).fill(c.shoes);
    g.roundRect(CX + 0.5 + rOff, shoeY - 2, shoeW - 0.5, 2, 1).fill(c.shoes);
  } else if (isHeels) {
    // Small heel
    g.roundRect(CX - 4.5 + lOff, shoeY + shoeH, 1, 1.5, 0.3).fill(c.shoesShade);
    g.roundRect(CX + 0.5 + rOff, shoeY + shoeH, 1, 1.5, 0.3).fill(c.shoesShade);
  }
}

// ═══════════════════════════════════════════
// HATS
// ═══════════════════════════════════════════

function drawHat(g: Graphics, hatId: string, c: Colors) {
  const h = c.hat!;
  const sh = c.hatShade!;

  if (hatId.includes("baseball")) {
    // Cap dome
    g.ellipse(CX, HEAD_CY - 5, HEAD_RX, 4).fill(h);
    // Brim
    g.ellipse(CX + 2, HEAD_CY - 2, HEAD_RX + 2, 1.5).fill(sh);
    g.ellipse(CX, HEAD_CY - 5, HEAD_RX, 4).stroke({ color: c.outline, width: OUTLINE });
  } else if (hatId.includes("beanie")) {
    // Beanie dome
    g.ellipse(CX, HEAD_CY - 5, HEAD_RX + 0.5, 5).fill(h);
    // Pom-pom
    g.circle(CX, HEAD_CY - 9.5, 2).fill(lightenColor(h, 0.3));
    g.circle(CX, HEAD_CY - 9.5, 2).stroke({ color: c.outline, width: OUTLINE * 0.6 });
    // Ribbed edge
    g.moveTo(CX - HEAD_RX - 0.5, HEAD_CY - 1).lineTo(CX + HEAD_RX + 0.5, HEAD_CY - 1)
      .stroke({ color: sh, width: 1.5 });
    g.ellipse(CX, HEAD_CY - 5, HEAD_RX + 0.5, 5).stroke({ color: c.outline, width: OUTLINE });
  } else if (hatId.includes("crown")) {
    // Crown base
    g.roundRect(CX - 7, HEAD_CY - 7, 14, 4, 1).fill(h);
    // Crown points
    g.moveTo(CX - 7, HEAD_CY - 7).lineTo(CX - 5, HEAD_CY - 11).lineTo(CX - 3, HEAD_CY - 7).fill(h);
    g.moveTo(CX - 2, HEAD_CY - 7).lineTo(CX, HEAD_CY - 12).lineTo(CX + 2, HEAD_CY - 7).fill(h);
    g.moveTo(CX + 3, HEAD_CY - 7).lineTo(CX + 5, HEAD_CY - 11).lineTo(CX + 7, HEAD_CY - 7).fill(h);
    // Jewels
    g.circle(CX - 3, HEAD_CY - 5.5, 1).fill(0xe53935);
    g.circle(CX + 3, HEAD_CY - 5.5, 1).fill(0x2196f3);
    // Outline
    g.moveTo(CX - 7, HEAD_CY - 3)
      .lineTo(CX - 7, HEAD_CY - 7).lineTo(CX - 5, HEAD_CY - 11)
      .lineTo(CX - 3, HEAD_CY - 7).lineTo(CX - 2, HEAD_CY - 7)
      .lineTo(CX, HEAD_CY - 12).lineTo(CX + 2, HEAD_CY - 7)
      .lineTo(CX + 3, HEAD_CY - 7).lineTo(CX + 5, HEAD_CY - 11)
      .lineTo(CX + 7, HEAD_CY - 7).lineTo(CX + 7, HEAD_CY - 3)
      .stroke({ color: c.outline, width: OUTLINE });
  } else if (hatId.includes("wizard")) {
    // Wizard hat cone
    g.moveTo(CX - 8, HEAD_CY - 2)
      .lineTo(CX, HEAD_CY - 16)
      .lineTo(CX + 8, HEAD_CY - 2)
      .closePath()
      .fill(h);
    // Star decoration
    drawStar(g, CX, HEAD_CY - 9, 1.5, 0xffd700);
    // Wide brim
    g.ellipse(CX, HEAD_CY - 2, HEAD_RX + 4, 2).fill(sh);
    // Outline
    g.moveTo(CX - 8, HEAD_CY - 2)
      .lineTo(CX, HEAD_CY - 16)
      .lineTo(CX + 8, HEAD_CY - 2)
      .stroke({ color: c.outline, width: OUTLINE });
    g.ellipse(CX, HEAD_CY - 2, HEAD_RX + 4, 2).stroke({ color: c.outline, width: OUTLINE });
  } else if (hatId.includes("santa")) {
    // Santa hat curve
    g.ellipse(CX, HEAD_CY - 5, HEAD_RX + 0.5, 5).fill(h);
    // Drooping tip
    g.ellipse(CX + 7, HEAD_CY - 7, 3, 2.5).fill(h);
    // Pom-pom
    g.circle(CX + 9, HEAD_CY - 7, 1.8).fill(0xf5f5f5);
    // White trim
    g.roundRect(CX - HEAD_RX - 0.5, HEAD_CY - 1.5, HEAD_RX * 2 + 1, 2.5, 1).fill(0xf5f5f5);
    g.ellipse(CX, HEAD_CY - 5, HEAD_RX + 0.5, 5).stroke({ color: c.outline, width: OUTLINE });
  } else if (hatId.includes("headphones")) {
    // Band across top
    g.arc(CX, HEAD_CY - 2, HEAD_RX + 1, Math.PI, 0, false)
      .stroke({ color: h, width: 2 });
    // Ear cups
    g.roundRect(CX - HEAD_RX - 3, HEAD_CY - 1, 3.5, 5, 1.5).fill(h);
    g.roundRect(CX + HEAD_RX - 0.5, HEAD_CY - 1, 3.5, 5, 1.5).fill(h);
    // Cushion
    g.roundRect(CX - HEAD_RX - 2.5, HEAD_CY, 2, 3, 1).fill(sh);
    g.roundRect(CX + HEAD_RX, HEAD_CY, 2, 3, 1).fill(sh);
    // Outline
    g.roundRect(CX - HEAD_RX - 3, HEAD_CY - 1, 3.5, 5, 1.5).stroke({ color: c.outline, width: OUTLINE * 0.7 });
    g.roundRect(CX + HEAD_RX - 0.5, HEAD_CY - 1, 3.5, 5, 1.5).stroke({ color: c.outline, width: OUTLINE * 0.7 });
  } else if (hatId.includes("halo")) {
    // Floating halo ring
    g.ellipse(CX, HEAD_CY - HEAD_RY - 3, 7, 1.5)
      .fill({ color: 0xffd700, alpha: 0.7 });
    g.ellipse(CX, HEAD_CY - HEAD_RY - 3, 7, 1.5)
      .stroke({ color: 0xffecb3, width: 0.8 });
  } else if (hatId.includes("devil")) {
    // Devil horns
    g.moveTo(CX - 7, HEAD_CY - 3).lineTo(CX - 9, HEAD_CY - 10).lineTo(CX - 4, HEAD_CY - 5).fill(h);
    g.moveTo(CX + 7, HEAD_CY - 3).lineTo(CX + 9, HEAD_CY - 10).lineTo(CX + 4, HEAD_CY - 5).fill(h);
    g.moveTo(CX - 7, HEAD_CY - 3).lineTo(CX - 9, HEAD_CY - 10).lineTo(CX - 4, HEAD_CY - 5)
      .stroke({ color: c.outline, width: OUTLINE * 0.7 });
    g.moveTo(CX + 7, HEAD_CY - 3).lineTo(CX + 9, HEAD_CY - 10).lineTo(CX + 4, HEAD_CY - 5)
      .stroke({ color: c.outline, width: OUTLINE * 0.7 });
  } else if (hatId.includes("astronaut")) {
    // Helmet dome
    g.circle(CX, HEAD_CY, HEAD_RY + 2.5).fill({ color: 0xe0e0e0, alpha: 0.85 });
    // Visor
    g.ellipse(CX, HEAD_CY + 0.5, HEAD_RX - 1, HEAD_RY - 1.5)
      .fill({ color: 0x42a5f5, alpha: 0.5 });
    // Glare
    g.ellipse(CX - 3, HEAD_CY - 2, 2, 1.5).fill({ color: 0x90caf9, alpha: 0.4 });
    g.circle(CX, HEAD_CY, HEAD_RY + 2.5).stroke({ color: c.outline, width: OUTLINE });
  }
}

// ═══════════════════════════════════════════
// ACCESSORIES
// ═══════════════════════════════════════════

function drawAccessoryBack(g: Graphics, accId: string | null, c: Colors) {
  if (!accId) return;

  if (accId.includes("cape")) {
    // Cape flowing behind
    g.moveTo(BODY_CX - BODY_W / 2, BODY_TOP + 1)
      .bezierCurveTo(BODY_CX - BODY_W, BODY_TOP + BODY_H, BODY_CX - BODY_W, LEG_TOP + 4, BODY_CX - 3, LEG_TOP + 5)
      .lineTo(BODY_CX + 3, LEG_TOP + 5)
      .bezierCurveTo(BODY_CX + BODY_W, LEG_TOP + 4, BODY_CX + BODY_W, BODY_TOP + BODY_H, BODY_CX + BODY_W / 2, BODY_TOP + 1)
      .fill(c.acc);
    g.moveTo(BODY_CX - BODY_W / 2, BODY_TOP + 1)
      .bezierCurveTo(BODY_CX - BODY_W, BODY_TOP + BODY_H, BODY_CX - BODY_W, LEG_TOP + 4, BODY_CX - 3, LEG_TOP + 5)
      .lineTo(BODY_CX + 3, LEG_TOP + 5)
      .bezierCurveTo(BODY_CX + BODY_W, LEG_TOP + 4, BODY_CX + BODY_W, BODY_TOP + BODY_H, BODY_CX + BODY_W / 2, BODY_TOP + 1)
      .stroke({ color: darkenColor(c.acc, 0.3), width: OUTLINE * 0.6 });
  } else if (accId.includes("wings")) {
    // Left wing
    g.moveTo(BODY_CX - BODY_W / 2, BODY_TOP + 2)
      .bezierCurveTo(BODY_CX - 12, BODY_TOP - 2, BODY_CX - 14, BODY_TOP + 3, BODY_CX - BODY_W / 2 - 1, BODY_TOP + 5)
      .fill({ color: c.acc, alpha: 0.7 });
    // Right wing
    g.moveTo(BODY_CX + BODY_W / 2, BODY_TOP + 2)
      .bezierCurveTo(BODY_CX + 12, BODY_TOP - 2, BODY_CX + 14, BODY_TOP + 3, BODY_CX + BODY_W / 2 + 1, BODY_TOP + 5)
      .fill({ color: c.acc, alpha: 0.7 });
    // Shine
    g.ellipse(BODY_CX - 10, BODY_TOP, 1.5, 1).fill({ color: lightenColor(c.acc, 0.3), alpha: 0.5 });
    g.ellipse(BODY_CX + 10, BODY_TOP, 1.5, 1).fill({ color: lightenColor(c.acc, 0.3), alpha: 0.5 });
  } else if (accId.includes("backpack")) {
    // Backpack behind right side
    g.roundRect(BODY_CX + BODY_W / 2 - 1, BODY_TOP, 5, 7, 2).fill(c.acc);
    g.roundRect(BODY_CX + BODY_W / 2 - 1, BODY_TOP, 5, 7, 2)
      .stroke({ color: darkenColor(c.acc, 0.2), width: OUTLINE * 0.5 });
    // Pocket
    g.roundRect(BODY_CX + BODY_W / 2, BODY_TOP + 3, 3, 2, 0.8).fill(darkenColor(c.acc, 0.15));
  } else if (accId.includes("shield")) {
    // Shield on left side
    g.ellipse(BODY_CX - BODY_W / 2 - 3, BODY_TOP + 3, 3, 4).fill(c.acc);
    g.ellipse(BODY_CX - BODY_W / 2 - 3, BODY_TOP + 3, 3, 4)
      .stroke({ color: darkenColor(c.acc, 0.2), width: OUTLINE * 0.5 });
    // Cross pattern
    g.moveTo(BODY_CX - BODY_W / 2 - 3, BODY_TOP + 0.5)
      .lineTo(BODY_CX - BODY_W / 2 - 3, BODY_TOP + 5.5)
      .stroke({ color: lightenColor(c.acc, 0.2), width: 0.8 });
  }
}

function drawAccessoryFront(g: Graphics, accId: string | null, c: Colors) {
  if (!accId) return;

  if (accId.includes("sword")) {
    // Sword on right side
    const sx = BODY_CX + BODY_W / 2 + 3;
    // Blade
    g.roundRect(sx - 0.5, HEAD_CY, 1, 14, 0.3).fill(0xc0c0c0);
    g.roundRect(sx - 0.5, HEAD_CY, 1, 14, 0.3).stroke({ color: 0x808080, width: 0.4 });
    // Guard
    g.roundRect(sx - 2, BODY_TOP + 1, 4, 1, 0.5).fill(0xffd700);
    // Handle
    g.roundRect(sx - 0.5, BODY_TOP + 2, 1, 3, 0.3).fill(0x8d6e63);
  } else if (accId.includes("pet_cat")) {
    // Small cat companion
    const px = BODY_CX + 10;
    const py = LEG_TOP + LEG_LEN;
    g.circle(px, py - 2, 2).fill(c.acc); // head
    g.ellipse(px, py + 0.5, 2, 1.5).fill(c.acc); // body
    // Ears
    g.moveTo(px - 2, py - 3.5).lineTo(px - 1, py - 5).lineTo(px, py - 3.5).fill(c.acc);
    g.moveTo(px, py - 3.5).lineTo(px + 1, py - 5).lineTo(px + 2, py - 3.5).fill(c.acc);
    // Eyes
    g.circle(px - 0.8, py - 2.2, 0.4).fill(c.outline);
    g.circle(px + 0.8, py - 2.2, 0.4).fill(c.outline);
    // Tail
    g.moveTo(px + 2, py + 0.5)
      .bezierCurveTo(px + 4, py, px + 4, py - 2, px + 3, py - 3)
      .stroke({ color: c.acc, width: 0.8 });
  } else if (accId.includes("pet_dog")) {
    const px = BODY_CX + 10;
    const py = LEG_TOP + LEG_LEN;
    g.circle(px, py - 2, 2.2).fill(c.acc); // head
    g.ellipse(px, py + 0.5, 2.2, 1.5).fill(c.acc); // body
    // Floppy ears
    g.ellipse(px - 2.5, py - 1, 1.2, 2).fill(darkenColor(c.acc, 0.2));
    g.ellipse(px + 2.5, py - 1, 1.2, 2).fill(darkenColor(c.acc, 0.2));
    // Eyes
    g.circle(px - 0.8, py - 2.5, 0.4).fill(c.outline);
    g.circle(px + 0.8, py - 2.5, 0.4).fill(c.outline);
    // Tongue
    g.ellipse(px, py - 0.8, 0.6, 0.4).fill(0xff8a80);
    // Tail
    g.moveTo(px + 2.2, py + 0.5)
      .bezierCurveTo(px + 4, py - 1, px + 5, py - 2, px + 4, py - 3)
      .stroke({ color: c.acc, width: 1 });
  }
}
