/**
 * Japanese Anime Chibi Character (Shin-chan / Doraemon style)
 *
 * Vector drawing with PixiJS Graphics — BIG round head, expressive anime eyes,
 * pudgy body, bold thick outlines, vivid colors.
 * Canvas: 64×80  |  Head ~50%  |  Body ~28%  |  Legs ~22%
 */
import { Container, Graphics } from "pixi.js";
import { EquippedItems } from "@/types/avatar";
import { getItemById } from "@/data/avatarItems";
import { parseColor, darkenColor, lightenColor } from "./colorUtils";
import type { CharacterPose } from "@/types/classroom";

// ─── Canvas dimensions ───
export const GRID_W = 64;
export const GRID_H = 80;

// ─── Layout constants (scaled for 64×80) ───
const CX = 32;          // center x
const HEAD_CY = 22;     // head center y
const HEAD_RX = 20;     // head radius x — BIG wide face
const HEAD_RY = 18;     // head radius y
const BODY_TOP = 41;    // body starts
const BODY_CX = CX;
const BODY_W = 24;      // body width
const BODY_H = 14;      // body height
const ARM_LEN = 12;
const LEG_TOP = BODY_TOP + BODY_H;
const LEG_LEN = 12;
const OL = 2.2;         // outline stroke width — BOLD
const OL_COLOR = 0x1a1a2e;

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

function resolveColors(eq: EquippedItems): Colors {
  const skin = parseColor(getItemById(eq.skin)?.svgProps?.color || "#F5D5C0");
  const hair = parseColor(getItemById(eq.hairColor)?.svgProps?.color || "#2C2C2C");
  const shirt = parseColor(getItemById(eq.shirt)?.svgProps?.color || "#4DB6AC");
  const pants = parseColor(getItemById(eq.pants)?.svgProps?.color || "#4A90E2");
  const shoes = parseColor(getItemById(eq.shoes)?.svgProps?.color || "#F0F0F0");
  const hatItem = eq.hat ? getItemById(eq.hat) : null;
  const hat = hatItem ? parseColor(hatItem.svgProps?.color || "#E53935") : null;

  return {
    skin, skinShade: darkenColor(skin, 0.15),
    hair, hairHi: lightenColor(hair, 0.25), hairDark: darkenColor(hair, 0.2),
    shirt, shirtShade: darkenColor(shirt, 0.2),
    pants, pantsShade: darkenColor(pants, 0.2),
    shoes, shoesShade: darkenColor(shoes, 0.25),
    hat, hatShade: hat ? darkenColor(hat, 0.2) : null,
    acc: 0x80deea, outline: OL_COLOR,
    eye: 0x1a1a2e, mouth: 0xc06060,
    white: 0xffffff, blush: 0xffb4b4,
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
  blinkFrame: number = 0,
  pose: CharacterPose = "idle",
): void {
  container.removeChildren();
  const c = resolveColors(equipped);
  const g = new Graphics();
  container.addChild(g);

  const hairStyle = getItemById(equipped.hair)?.svgProps?.path || "short";
  const hasHat = !!equipped.hat;
  const lOff = walkFrame === 1 ? -3 : walkFrame === 2 ? 3 : 0;
  const rOff = walkFrame === 1 ? 3 : walkFrame === 2 ? -3 : 0;

  // Draw order (back → front)
  drawShadow(g, pose);
  drawAccessoryBack(g, equipped.accessory, c);

  if (pose === "sitting") {
    drawSittingLegs(g, c, equipped.pants);
    drawSittingShoes(g, c, equipped.shoes);
  } else {
    drawLegs(g, c, lOff, rOff, equipped.pants);
    drawShoes(g, c, lOff, rOff, equipped.shoes);
  }

  drawBody(g, c, equipped.shirt);

  if (pose === "reading") {
    drawReadingArms(g, c);
  } else if (pose === "sitting") {
    drawSittingArms(g, c);
  } else {
    drawArms(g, c, walkFrame);
  }

  drawNeck(g, c);
  drawHead(g, c);
  if (!hasHat) drawHair(g, hairStyle, c);
  if (hasHat) drawHat(g, equipped.hat!, c);
  drawFace(g, c, emotion, blinkFrame, equipped.accessory);
  drawAccessoryFront(g, equipped.accessory, c);

  if (pose === "reading") {
    drawBook(g);
  }
}

// ═══════════════════════════════════════════
// SHADOW
// ═══════════════════════════════════════════

function drawShadow(g: Graphics, pose: CharacterPose = "idle") {
  if (pose === "sitting") {
    // Wider shadow for sitting pose
    g.ellipse(CX, 77, 18, 3).fill({ color: 0x000000, alpha: 0.1 });
  } else {
    g.ellipse(CX, 77, 14, 2.5).fill({ color: 0x000000, alpha: 0.12 });
  }
}

// ═══════════════════════════════════════════
// HEAD — BIG round anime head
// ═══════════════════════════════════════════

function drawHead(g: Graphics, c: Colors) {
  // Skin fill
  g.ellipse(CX, HEAD_CY, HEAD_RX, HEAD_RY).fill(c.skin);
  // Soft shading on right cheek area
  g.ellipse(CX + 6, HEAD_CY + 3, HEAD_RX - 5, HEAD_RY - 3)
    .fill({ color: c.skinShade, alpha: 0.2 });
  // Bold outline
  g.ellipse(CX, HEAD_CY, HEAD_RX, HEAD_RY).stroke({ color: c.outline, width: OL });
}

// ═══════════════════════════════════════════
// NECK
// ═══════════════════════════════════════════

function drawNeck(g: Graphics, c: Colors) {
  g.roundRect(CX - 4, HEAD_CY + HEAD_RY - 2, 8, 5, 2).fill(c.skin);
}

// ═══════════════════════════════════════════
// FACE — Big anime eyes, blush, expressive mouth
// ═══════════════════════════════════════════

function drawFace(
  g: Graphics, c: Colors,
  emotion: StickerEmotion, blinkFrame: number,
  accId: string | null,
) {
  const eyeY = HEAD_CY - 1;
  const eyeLX = CX - 8;
  const eyeRX = CX + 8;
  const eyeRX_r = 4.2;  // eye radius x
  const eyeRY_r = 5;    // eye radius y — tall anime eyes

  // ── EYES ──
  if (blinkFrame >= 2) {
    // Closed — curved lines (happy squint style)
    g.arc(eyeLX, eyeY, eyeRX_r, 0.2, Math.PI - 0.2, false)
      .stroke({ color: c.eye, width: 2 });
    g.arc(eyeRX, eyeY, eyeRX_r, 0.2, Math.PI - 0.2, false)
      .stroke({ color: c.eye, width: 2 });
  } else if (blinkFrame === 1) {
    // Half-closed
    g.ellipse(eyeLX, eyeY, eyeRX_r, eyeRY_r * 0.3).fill(c.eye);
    g.ellipse(eyeRX, eyeY, eyeRX_r, eyeRY_r * 0.3).fill(c.eye);
  } else if (emotion === "happy" || emotion === "love") {
    // Happy squint ＾＾
    g.arc(eyeLX, eyeY + 1, eyeRX_r, Math.PI + 0.2, -0.2, false)
      .stroke({ color: c.eye, width: 2.5 });
    g.arc(eyeRX, eyeY + 1, eyeRX_r, Math.PI + 0.2, -0.2, false)
      .stroke({ color: c.eye, width: 2.5 });
  } else if (emotion === "surprised") {
    // Big round eyes
    const br = eyeRX_r * 1.3;
    drawAnimeEye(g, eyeLX, eyeY, br, br * 1.2, c, true);
    drawAnimeEye(g, eyeRX, eyeY, br, br * 1.2, c, true);
  } else if (emotion === "angry") {
    drawAnimeEye(g, eyeLX, eyeY, eyeRX_r, eyeRY_r, c, false);
    drawAnimeEye(g, eyeRX, eyeY, eyeRX_r, eyeRY_r, c, false);
    // Angry brows ╬
    g.moveTo(eyeLX - 5, eyeY - eyeRY_r - 2)
      .lineTo(eyeLX + 5, eyeY - eyeRY_r + 1)
      .stroke({ color: c.eye, width: 2.5 });
    g.moveTo(eyeRX + 5, eyeY - eyeRY_r - 2)
      .lineTo(eyeRX - 5, eyeY - eyeRY_r + 1)
      .stroke({ color: c.eye, width: 2.5 });
  } else if (emotion === "sad") {
    drawAnimeEye(g, eyeLX, eyeY, eyeRX_r, eyeRY_r * 0.8, c, false);
    drawAnimeEye(g, eyeRX, eyeY, eyeRX_r, eyeRY_r * 0.8, c, false);
    // Sad brows
    g.moveTo(eyeLX - 4, eyeY - eyeRY_r + 1)
      .lineTo(eyeLX + 4, eyeY - eyeRY_r - 2)
      .stroke({ color: c.eye, width: 2 });
    g.moveTo(eyeRX + 4, eyeY - eyeRY_r + 1)
      .lineTo(eyeRX - 4, eyeY - eyeRY_r - 2)
      .stroke({ color: c.eye, width: 2 });
  } else {
    // Normal idle — big anime eyes
    drawAnimeEye(g, eyeLX, eyeY, eyeRX_r, eyeRY_r, c, false);
    drawAnimeEye(g, eyeRX, eyeY, eyeRX_r, eyeRY_r, c, false);
  }

  // ── Love: heart overlay ──
  if (emotion === "love") {
    drawHeart(g, eyeLX, eyeY, 6, 0xff4081);
    drawHeart(g, eyeRX, eyeY, 6, 0xff4081);
  }

  // ── Blush ──
  const ba = emotion === "happy" || emotion === "love" ? 0.5 : 0.3;
  g.ellipse(CX - 14, HEAD_CY + 5.5, 4, 2.5).fill({ color: c.blush, alpha: ba });
  g.ellipse(CX + 14, HEAD_CY + 5.5, 4, 2.5).fill({ color: c.blush, alpha: ba });

  // ── Nose ──
  g.ellipse(CX, HEAD_CY + 4, 1, 0.7).fill({ color: c.skinShade, alpha: 0.45 });

  // ── Mouth ──
  drawMouth(g, c, emotion);

  // ── Glasses ──
  if (accId === "acc_glasses") {
    drawGlasses(g, eyeLX, eyeRX, eyeY, eyeRX_r + 2, c);
  }

  // ── Sad tears ──
  if (emotion === "sad") {
    g.ellipse(eyeLX + 2, eyeY + eyeRY_r + 3, 1.5, 2).fill({ color: 0x64b5f6, alpha: 0.6 });
    g.ellipse(eyeRX - 2, eyeY + eyeRY_r + 3, 1.5, 2).fill({ color: 0x64b5f6, alpha: 0.6 });
  }

  // ── Angry cross vein ──
  if (emotion === "angry") {
    g.ellipse(CX - 14, HEAD_CY + 5.5, 4.5, 2.8).fill({ color: 0xff5252, alpha: 0.35 });
    g.ellipse(CX + 14, HEAD_CY + 5.5, 4.5, 2.8).fill({ color: 0xff5252, alpha: 0.35 });
    // Cross vein mark
    const vx = CX + 13, vy = HEAD_CY - 10;
    g.moveTo(vx - 2, vy).lineTo(vx + 2, vy).stroke({ color: 0xff5252, width: 1.5 });
    g.moveTo(vx, vy - 2).lineTo(vx, vy + 2).stroke({ color: 0xff5252, width: 1.5 });
  }
}

function drawAnimeEye(
  g: Graphics, cx: number, cy: number,
  rx: number, ry: number, c: Colors,
  big: boolean,
) {
  // White sclera
  g.ellipse(cx, cy, rx, ry).fill(c.white);
  // Big dark iris
  const irisR = big ? rx * 0.75 : rx * 0.7;
  g.ellipse(cx, cy + 0.5, irisR, ry * 0.7).fill(c.eye);
  // Pupil (darker center)
  g.ellipse(cx, cy + 1, irisR * 0.5, ry * 0.4).fill(darkenColor(c.eye, 0.3));
  // Big highlight (top-right)
  g.circle(cx + rx * 0.25, cy - ry * 0.25, rx * 0.3).fill(c.white);
  // Small highlight (bottom-left)
  g.circle(cx - rx * 0.2, cy + ry * 0.2, rx * 0.15).fill({ color: c.white, alpha: 0.7 });
  // Outline
  g.ellipse(cx, cy, rx, ry).stroke({ color: c.eye, width: 1.2 });
}

function drawHeart(g: Graphics, cx: number, cy: number, size: number, color: number) {
  const s = size * 0.5;
  g.moveTo(cx, cy + s * 0.7)
    .bezierCurveTo(cx - s * 1.4, cy - s * 0.3, cx - s * 0.6, cy - s * 1.5, cx, cy - s * 0.4)
    .bezierCurveTo(cx + s * 0.6, cy - s * 1.5, cx + s * 1.4, cy - s * 0.3, cx, cy + s * 0.7)
    .fill(color);
}

function drawMouth(g: Graphics, c: Colors, emotion: StickerEmotion) {
  const mx = CX, my = HEAD_CY + 9;

  switch (emotion) {
    case "happy":
      // Big open smile — Shin-chan style
      g.arc(mx, my - 1, 6, 0.1, Math.PI - 0.1, false).fill(c.mouth);
      g.arc(mx, my - 1, 6, 0.1, Math.PI - 0.1, false)
        .stroke({ color: c.outline, width: 1.5 });
      // Tongue
      g.ellipse(mx, my + 2, 3, 2).fill(0xff8a80);
      break;
    case "sad":
      g.arc(mx, my + 3, 5, Math.PI + 0.3, -0.3, false)
        .stroke({ color: c.mouth, width: 2 });
      break;
    case "surprised":
      // Big O mouth
      g.ellipse(mx, my + 1, 4, 5).fill(c.mouth);
      g.ellipse(mx, my + 1, 2.5, 3.5).fill({ color: 0x8b3a3a, alpha: 0.5 });
      g.ellipse(mx, my + 1, 4, 5).stroke({ color: c.outline, width: 1.2 });
      break;
    case "angry":
      // Gritted teeth
      g.moveTo(mx - 5, my).lineTo(mx + 5, my - 1)
        .stroke({ color: c.mouth, width: 2.5 });
      break;
    case "love":
      // Cat mouth :3
      g.arc(mx - 2.5, my, 2.5, 0.1, Math.PI - 0.1, false)
        .stroke({ color: c.mouth, width: 1.5 });
      g.arc(mx + 2.5, my, 2.5, 0.1, Math.PI - 0.1, false)
        .stroke({ color: c.mouth, width: 1.5 });
      break;
    default:
      // Gentle smile — anime style
      g.arc(mx, my, 4, 0.2, Math.PI - 0.2, false)
        .stroke({ color: c.mouth, width: 1.8 });
  }
}

function drawGlasses(
  g: Graphics, lx: number, rx: number, ey: number, r: number, c: Colors,
) {
  g.circle(lx, ey, r).stroke({ color: c.acc, width: 1.8 });
  g.circle(rx, ey, r).stroke({ color: c.acc, width: 1.8 });
  g.moveTo(lx + r, ey).lineTo(rx - r, ey).stroke({ color: c.acc, width: 1.5 });
  g.moveTo(lx - r, ey).lineTo(lx - r - 4, ey - 1).stroke({ color: c.acc, width: 1.2 });
  g.moveTo(rx + r, ey).lineTo(rx + r + 4, ey - 1).stroke({ color: c.acc, width: 1.2 });
}

// ═══════════════════════════════════════════
// HAIR — all 8 styles (anime proportions)
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
  // Big dome over top of head
  g.ellipse(CX, HEAD_CY - 7, HEAD_RX + 2, 13).fill(c.hair);
  // Side tufts
  g.ellipse(CX - 16, HEAD_CY - 2, 6, 8).fill(c.hair);
  g.ellipse(CX + 16, HEAD_CY - 2, 6, 8).fill(c.hair);
  // Highlights
  g.ellipse(CX - 4, HEAD_CY - 14, 6, 2.5).fill({ color: c.hairHi, alpha: 0.45 });
  // Outline
  g.ellipse(CX, HEAD_CY - 7, HEAD_RX + 2, 13).stroke({ color: c.outline, width: OL });
}

function drawLongHair(g: Graphics, c: Colors) {
  g.ellipse(CX, HEAD_CY - 7, HEAD_RX + 2, 13).fill(c.hair);
  // Long flowing sides
  g.roundRect(CX - HEAD_RX - 4, HEAD_CY - 4, 8, 28, 4).fill(c.hair);
  g.roundRect(CX + HEAD_RX - 4, HEAD_CY - 4, 8, 28, 4).fill(c.hair);
  // Shade
  g.roundRect(CX - HEAD_RX - 4, HEAD_CY + 8, 8, 16, 4).fill({ color: c.hairDark, alpha: 0.35 });
  g.roundRect(CX + HEAD_RX - 4, HEAD_CY + 8, 8, 16, 4).fill({ color: c.hairDark, alpha: 0.35 });
  // Highlight
  g.ellipse(CX - 4, HEAD_CY - 14, 6, 2.5).fill({ color: c.hairHi, alpha: 0.45 });
  // Outlines
  g.ellipse(CX, HEAD_CY - 7, HEAD_RX + 2, 13).stroke({ color: c.outline, width: OL });
  g.roundRect(CX - HEAD_RX - 4, HEAD_CY - 4, 8, 28, 4).stroke({ color: c.outline, width: OL * 0.7 });
  g.roundRect(CX + HEAD_RX - 4, HEAD_CY - 4, 8, 28, 4).stroke({ color: c.outline, width: OL * 0.7 });
}

function drawPonytailHair(g: Graphics, c: Colors) {
  drawShortHair(g, c);
  g.ellipse(CX + 22, HEAD_CY - 2, 5, 10).fill(c.hair);
  g.ellipse(CX + 22, HEAD_CY + 4, 4, 6).fill({ color: c.hairDark, alpha: 0.3 });
  g.circle(CX + 19, HEAD_CY - 8, 2.5).fill(0xe91e63);
  g.ellipse(CX + 22, HEAD_CY - 2, 5, 10).stroke({ color: c.outline, width: OL * 0.7 });
}

function drawBunHair(g: Graphics, c: Colors) {
  drawShortHair(g, c);
  g.circle(CX, HEAD_CY - 19, 7).fill(c.hair);
  g.circle(CX - 2, HEAD_CY - 22, 2.5).fill({ color: c.hairHi, alpha: 0.4 });
  g.circle(CX, HEAD_CY - 19, 7).stroke({ color: c.outline, width: OL * 0.7 });
}

function drawCurlyHair(g: Graphics, c: Colors) {
  const curls = [
    { x: CX - 12, y: HEAD_CY - 10, r: 8 },
    { x: CX, y: HEAD_CY - 14, r: 9 },
    { x: CX + 12, y: HEAD_CY - 10, r: 8 },
    { x: CX - 17, y: HEAD_CY, r: 7 },
    { x: CX + 17, y: HEAD_CY, r: 7 },
    { x: CX - 15, y: HEAD_CY + 8, r: 6 },
    { x: CX + 15, y: HEAD_CY + 8, r: 6 },
  ];
  for (const curl of curls) g.circle(curl.x, curl.y, curl.r).fill(c.hair);
  g.circle(CX - 4, HEAD_CY - 16, 3).fill({ color: c.hairHi, alpha: 0.4 });
  for (const curl of curls) g.circle(curl.x, curl.y, curl.r).stroke({ color: c.outline, width: OL * 0.6 });
}

function drawSpikeHair(g: Graphics, c: Colors) {
  g.ellipse(CX, HEAD_CY - 6, HEAD_RX + 2, 11).fill(c.hair);
  const spikes = [
    { x: CX - 10, tipY: HEAD_CY - 24 },
    { x: CX - 2, tipY: HEAD_CY - 28 },
    { x: CX + 6, tipY: HEAD_CY - 26 },
    { x: CX + 14, tipY: HEAD_CY - 22 },
  ];
  for (const s of spikes) {
    g.moveTo(s.x - 4, HEAD_CY - 10).lineTo(s.x + 1, s.tipY).lineTo(s.x + 6, HEAD_CY - 10).fill(c.hair);
    g.moveTo(s.x - 4, HEAD_CY - 10).lineTo(s.x + 1, s.tipY).lineTo(s.x + 6, HEAD_CY - 10)
      .stroke({ color: c.outline, width: OL * 0.7 });
  }
  g.ellipse(CX - 2, HEAD_CY - 18, 3, 2).fill({ color: c.hairHi, alpha: 0.5 });
  g.ellipse(CX, HEAD_CY - 6, HEAD_RX + 2, 11).stroke({ color: c.outline, width: OL });
}

function drawAfroHair(g: Graphics, c: Colors) {
  g.circle(CX, HEAD_CY - 4, 27).fill(c.hair);
  g.circle(CX - 12, HEAD_CY - 18, 4).fill({ color: c.hairHi, alpha: 0.3 });
  g.circle(CX + 8, HEAD_CY - 20, 3).fill({ color: c.hairHi, alpha: 0.3 });
  g.circle(CX, HEAD_CY - 4, 27).stroke({ color: c.outline, width: OL });
}

function drawMohawkHair(g: Graphics, c: Colors) {
  g.roundRect(CX - 6, HEAD_CY - 28, 12, 22, 5).fill(c.hair);
  g.ellipse(CX, HEAD_CY - 24, 3, 2).fill({ color: c.hairHi, alpha: 0.5 });
  g.ellipse(CX - 14, HEAD_CY - 3, 4, 6).fill({ color: c.skinShade, alpha: 0.2 });
  g.ellipse(CX + 14, HEAD_CY - 3, 4, 6).fill({ color: c.skinShade, alpha: 0.2 });
  g.roundRect(CX - 6, HEAD_CY - 28, 12, 22, 5).stroke({ color: c.outline, width: OL });
}

// ═══════════════════════════════════════════
// BODY — pudgy round torso (anime chibi)
// ═══════════════════════════════════════════

function drawBody(g: Graphics, c: Colors, shirtId: string) {
  g.roundRect(BODY_CX - BODY_W / 2, BODY_TOP, BODY_W, BODY_H, 6).fill(c.shirt);
  g.roundRect(BODY_CX + 2, BODY_TOP + 2, BODY_W / 2 - 3, BODY_H - 4, 4)
    .fill({ color: c.shirtShade, alpha: 0.25 });
  g.roundRect(BODY_CX - BODY_W / 2, BODY_TOP, BODY_W, BODY_H, 6)
    .stroke({ color: c.outline, width: OL });
  applyShirtPattern(g, shirtId, c);
}

function applyShirtPattern(g: Graphics, sid: string, c: Colors) {
  const t = BODY_TOP;
  const l = BODY_CX - BODY_W / 2 + 2;
  const r = BODY_CX + BODY_W / 2 - 2;

  if (sid.includes("striped")) {
    g.moveTo(l, t + 5).lineTo(r, t + 5).stroke({ color: c.shirtShade, width: 1.5 });
    g.moveTo(l, t + 9).lineTo(r, t + 9).stroke({ color: c.shirtShade, width: 1.5 });
  } else if (sid.includes("superhero")) {
    drawStar(g, BODY_CX, t + 7, 4, 0xffd700);
  } else if (sid.includes("hoodie")) {
    g.arc(BODY_CX, t + 1, 6, 0.3, Math.PI - 0.3, false)
      .stroke({ color: c.shirtShade, width: 1.5 });
    g.roundRect(BODY_CX - 6, t + 8, 12, 4, 2).stroke({ color: c.shirtShade, width: 1 });
  } else if (sid.includes("tuxedo")) {
    g.roundRect(BODY_CX - 3, t + 1, 6, BODY_H - 2, 2).fill(0xf0f0f0);
    g.moveTo(BODY_CX, t + 1).lineTo(BODY_CX - 2, t + 5)
      .lineTo(BODY_CX, t + 9).lineTo(BODY_CX + 2, t + 5)
      .closePath().fill(0xd32f2f);
  } else if (sid.includes("dragon")) {
    g.circle(BODY_CX, t + 7, 3).fill({ color: 0xffd700, alpha: 0.5 });
  } else if (sid.includes("galaxy")) {
    g.circle(BODY_CX - 4, t + 4, 1).fill(0xffffff);
    g.circle(BODY_CX + 4, t + 8, 0.8).fill(0xffffff);
    g.circle(BODY_CX + 2, t + 3, 0.6).fill(0x7c4dff);
  }
}

function drawStar(g: Graphics, cx: number, cy: number, r: number, color: number) {
  const pts: number[] = [];
  for (let i = 0; i < 5; i++) {
    const oa = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const ia = oa + Math.PI / 5;
    pts.push(cx + Math.cos(oa) * r, cy + Math.sin(oa) * r);
    pts.push(cx + Math.cos(ia) * r * 0.45, cy + Math.sin(ia) * r * 0.45);
  }
  g.poly(pts).fill(color);
}

// ═══════════════════════════════════════════
// ARMS — pudgy short arms
// ═══════════════════════════════════════════

function drawArms(g: Graphics, c: Colors, walkFrame: number) {
  const armY = BODY_TOP + 2;
  const armW = 7;
  const handR = 3.5;
  const swL = walkFrame === 1 ? -0.3 : walkFrame === 2 ? 0.3 : 0;
  const swR = walkFrame === 1 ? 0.3 : walkFrame === 2 ? -0.3 : 0;

  // Left arm
  const lx = BODY_CX - BODY_W / 2 - armW + 1;
  const ly = armY + Math.sin(swL) * 4;
  g.roundRect(lx, ly, armW, ARM_LEN - 2, 3).fill(c.shirt);
  g.roundRect(lx, ly, armW, ARM_LEN - 2, 3).stroke({ color: c.outline, width: OL * 0.7 });
  g.circle(lx + armW / 2, ly + ARM_LEN - 1, handR).fill(c.skin);
  g.circle(lx + armW / 2, ly + ARM_LEN - 1, handR).stroke({ color: c.outline, width: OL * 0.6 });

  // Right arm
  const rx = BODY_CX + BODY_W / 2 - 1;
  const ry = armY + Math.sin(swR) * 4;
  g.roundRect(rx, ry, armW, ARM_LEN - 2, 3).fill(c.shirtShade);
  g.roundRect(rx, ry, armW, ARM_LEN - 2, 3).stroke({ color: c.outline, width: OL * 0.7 });
  g.circle(rx + armW / 2, ry + ARM_LEN - 1, handR).fill(c.skinShade);
  g.circle(rx + armW / 2, ry + ARM_LEN - 1, handR).stroke({ color: c.outline, width: OL * 0.6 });
}

// ═══════════════════════════════════════════
// LEGS
// ═══════════════════════════════════════════

function drawLegs(g: Graphics, c: Colors, lOff: number, rOff: number, pantsId: string) {
  const isShorts = pantsId.includes("shorts");
  const isSkirt = pantsId.includes("skirt");
  const legW = 8;
  const legH = isShorts ? LEG_LEN - 4 : LEG_LEN;

  if (isSkirt) {
    g.moveTo(BODY_CX - BODY_W / 2, LEG_TOP)
      .lineTo(BODY_CX - BODY_W / 2 - 4, LEG_TOP + 7)
      .lineTo(BODY_CX + BODY_W / 2 + 4, LEG_TOP + 7)
      .lineTo(BODY_CX + BODY_W / 2, LEG_TOP).closePath().fill(c.pants);
    g.moveTo(BODY_CX - BODY_W / 2, LEG_TOP)
      .lineTo(BODY_CX - BODY_W / 2 - 4, LEG_TOP + 7)
      .lineTo(BODY_CX + BODY_W / 2 + 4, LEG_TOP + 7)
      .lineTo(BODY_CX + BODY_W / 2, LEG_TOP).closePath()
      .stroke({ color: c.outline, width: OL * 0.7 });
    g.roundRect(CX - 7 + lOff, LEG_TOP + 7, legW, 5, 2).fill(c.skin);
    g.roundRect(CX + 1 + rOff, LEG_TOP + 7, legW, 5, 2).fill(c.skin);
  } else {
    g.roundRect(CX - 7 + lOff, LEG_TOP, legW, legH, 3).fill(c.pants);
    g.roundRect(CX - 7 + lOff, LEG_TOP, legW, legH, 3).stroke({ color: c.outline, width: OL * 0.7 });
    g.roundRect(CX + 1 + rOff, LEG_TOP, legW, legH, 3).fill(c.pantsShade);
    g.roundRect(CX + 1 + rOff, LEG_TOP, legW, legH, 3).stroke({ color: c.outline, width: OL * 0.7 });
    if (isShorts) {
      g.roundRect(CX - 7 + lOff, LEG_TOP + legH, legW, 4, 2).fill(c.skin);
      g.roundRect(CX + 1 + rOff, LEG_TOP + legH, legW, 4, 2).fill(c.skin);
    }
  }
}

// ═══════════════════════════════════════════
// SHOES
// ═══════════════════════════════════════════

function drawShoes(g: Graphics, c: Colors, lOff: number, rOff: number, shoesId: string) {
  const sy = LEG_TOP + LEG_LEN - 1;
  const sw = 10, sh = 5;
  const isRocket = shoesId.includes("rocket");
  const isBoots = shoesId.includes("boots") && !isRocket;
  const isHeels = shoesId.includes("heels");

  g.roundRect(CX - 9 + lOff, sy, sw, sh, 2.5).fill(c.shoes);
  g.roundRect(CX - 9 + lOff, sy, sw, sh, 2.5).stroke({ color: c.outline, width: OL * 0.6 });
  g.roundRect(CX + 1 + rOff, sy, sw, sh, 2.5).fill(c.shoesShade);
  g.roundRect(CX + 1 + rOff, sy, sw, sh, 2.5).stroke({ color: c.outline, width: OL * 0.6 });

  if (isRocket) {
    g.ellipse(CX - 4 + lOff, sy + sh + 2, 3, 2).fill(0xff6d00);
    g.ellipse(CX + 6 + rOff, sy + sh + 2, 3, 2).fill(0xff6d00);
    g.ellipse(CX - 4 + lOff, sy + sh + 2, 1.5, 1.2).fill(0xffab00);
    g.ellipse(CX + 6 + rOff, sy + sh + 2, 1.5, 1.2).fill(0xffab00);
  } else if (isBoots) {
    g.roundRect(CX - 8 + lOff, sy - 4, sw - 1, 4, 2).fill(c.shoes);
    g.roundRect(CX + 1 + rOff, sy - 4, sw - 1, 4, 2).fill(c.shoes);
  } else if (isHeels) {
    g.roundRect(CX - 9 + lOff, sy + sh, 2, 3, 0.5).fill(c.shoesShade);
    g.roundRect(CX + 1 + rOff, sy + sh, 2, 3, 0.5).fill(c.shoesShade);
  }
}

// ═══════════════════════════════════════════
// HATS
// ═══════════════════════════════════════════

function drawHat(g: Graphics, hatId: string, c: Colors) {
  const h = c.hat!, sh = c.hatShade!;

  if (hatId.includes("baseball")) {
    g.ellipse(CX, HEAD_CY - 10, HEAD_RX + 1, 8).fill(h);
    g.ellipse(CX + 4, HEAD_CY - 4, HEAD_RX + 5, 3).fill(sh);
    g.ellipse(CX, HEAD_CY - 10, HEAD_RX + 1, 8).stroke({ color: c.outline, width: OL });
  } else if (hatId.includes("beanie")) {
    g.ellipse(CX, HEAD_CY - 10, HEAD_RX + 1, 10).fill(h);
    g.circle(CX, HEAD_CY - 19, 4).fill(lightenColor(h, 0.3));
    g.circle(CX, HEAD_CY - 19, 4).stroke({ color: c.outline, width: OL * 0.6 });
    g.moveTo(CX - HEAD_RX - 1, HEAD_CY - 2).lineTo(CX + HEAD_RX + 1, HEAD_CY - 2)
      .stroke({ color: sh, width: 3 });
    g.ellipse(CX, HEAD_CY - 10, HEAD_RX + 1, 10).stroke({ color: c.outline, width: OL });
  } else if (hatId.includes("crown")) {
    g.roundRect(CX - 14, HEAD_CY - 14, 28, 8, 2).fill(h);
    g.moveTo(CX - 14, HEAD_CY - 14).lineTo(CX - 10, HEAD_CY - 22).lineTo(CX - 6, HEAD_CY - 14).fill(h);
    g.moveTo(CX - 4, HEAD_CY - 14).lineTo(CX, HEAD_CY - 24).lineTo(CX + 4, HEAD_CY - 14).fill(h);
    g.moveTo(CX + 6, HEAD_CY - 14).lineTo(CX + 10, HEAD_CY - 22).lineTo(CX + 14, HEAD_CY - 14).fill(h);
    g.circle(CX - 6, HEAD_CY - 11, 2).fill(0xe53935);
    g.circle(CX + 6, HEAD_CY - 11, 2).fill(0x2196f3);
    g.roundRect(CX - 14, HEAD_CY - 14, 28, 8, 2).stroke({ color: c.outline, width: OL });
  } else if (hatId.includes("wizard")) {
    g.moveTo(CX - 16, HEAD_CY - 4).lineTo(CX, HEAD_CY - 32).lineTo(CX + 16, HEAD_CY - 4).closePath().fill(h);
    drawStar(g, CX, HEAD_CY - 18, 3, 0xffd700);
    g.ellipse(CX, HEAD_CY - 4, HEAD_RX + 8, 3.5).fill(sh);
    g.moveTo(CX - 16, HEAD_CY - 4).lineTo(CX, HEAD_CY - 32).lineTo(CX + 16, HEAD_CY - 4)
      .stroke({ color: c.outline, width: OL });
    g.ellipse(CX, HEAD_CY - 4, HEAD_RX + 8, 3.5).stroke({ color: c.outline, width: OL });
  } else if (hatId.includes("santa")) {
    g.ellipse(CX, HEAD_CY - 10, HEAD_RX + 1, 10).fill(h);
    g.ellipse(CX + 14, HEAD_CY - 14, 6, 5).fill(h);
    g.circle(CX + 18, HEAD_CY - 14, 3.5).fill(0xf5f5f5);
    g.roundRect(CX - HEAD_RX - 1, HEAD_CY - 3, HEAD_RX * 2 + 2, 5, 2).fill(0xf5f5f5);
    g.ellipse(CX, HEAD_CY - 10, HEAD_RX + 1, 10).stroke({ color: c.outline, width: OL });
  } else if (hatId.includes("headphones")) {
    g.arc(CX, HEAD_CY - 4, HEAD_RX + 2, Math.PI, 0, false).stroke({ color: h, width: 4 });
    g.roundRect(CX - HEAD_RX - 6, HEAD_CY - 2, 7, 10, 3).fill(h);
    g.roundRect(CX + HEAD_RX - 1, HEAD_CY - 2, 7, 10, 3).fill(h);
    g.roundRect(CX - HEAD_RX - 5, HEAD_CY, 4, 6, 2).fill(sh);
    g.roundRect(CX + HEAD_RX, HEAD_CY, 4, 6, 2).fill(sh);
    g.roundRect(CX - HEAD_RX - 6, HEAD_CY - 2, 7, 10, 3).stroke({ color: c.outline, width: OL * 0.7 });
    g.roundRect(CX + HEAD_RX - 1, HEAD_CY - 2, 7, 10, 3).stroke({ color: c.outline, width: OL * 0.7 });
  } else if (hatId.includes("halo")) {
    g.ellipse(CX, HEAD_CY - HEAD_RY - 5, 14, 3).fill({ color: 0xffd700, alpha: 0.7 });
    g.ellipse(CX, HEAD_CY - HEAD_RY - 5, 14, 3).stroke({ color: 0xffecb3, width: 1.5 });
  } else if (hatId.includes("devil")) {
    g.moveTo(CX - 14, HEAD_CY - 6).lineTo(CX - 18, HEAD_CY - 20).lineTo(CX - 8, HEAD_CY - 10).fill(h);
    g.moveTo(CX + 14, HEAD_CY - 6).lineTo(CX + 18, HEAD_CY - 20).lineTo(CX + 8, HEAD_CY - 10).fill(h);
    g.moveTo(CX - 14, HEAD_CY - 6).lineTo(CX - 18, HEAD_CY - 20).lineTo(CX - 8, HEAD_CY - 10)
      .stroke({ color: c.outline, width: OL * 0.7 });
    g.moveTo(CX + 14, HEAD_CY - 6).lineTo(CX + 18, HEAD_CY - 20).lineTo(CX + 8, HEAD_CY - 10)
      .stroke({ color: c.outline, width: OL * 0.7 });
  } else if (hatId.includes("astronaut")) {
    g.circle(CX, HEAD_CY, HEAD_RY + 5).fill({ color: 0xe0e0e0, alpha: 0.85 });
    g.ellipse(CX, HEAD_CY + 1, HEAD_RX - 2, HEAD_RY - 3).fill({ color: 0x42a5f5, alpha: 0.5 });
    g.ellipse(CX - 6, HEAD_CY - 4, 4, 3).fill({ color: 0x90caf9, alpha: 0.4 });
    g.circle(CX, HEAD_CY, HEAD_RY + 5).stroke({ color: c.outline, width: OL });
  }
}

// ═══════════════════════════════════════════
// ACCESSORIES
// ═══════════════════════════════════════════

function drawAccessoryBack(g: Graphics, accId: string | null, c: Colors) {
  if (!accId) return;
  if (accId.includes("cape")) {
    g.moveTo(BODY_CX - BODY_W / 2, BODY_TOP + 2)
      .bezierCurveTo(BODY_CX - BODY_W, BODY_TOP + BODY_H, BODY_CX - BODY_W, LEG_TOP + 8, BODY_CX - 6, LEG_TOP + 10)
      .lineTo(BODY_CX + 6, LEG_TOP + 10)
      .bezierCurveTo(BODY_CX + BODY_W, LEG_TOP + 8, BODY_CX + BODY_W, BODY_TOP + BODY_H, BODY_CX + BODY_W / 2, BODY_TOP + 2)
      .fill(c.acc);
  } else if (accId.includes("wings")) {
    g.moveTo(BODY_CX - BODY_W / 2, BODY_TOP + 4)
      .bezierCurveTo(BODY_CX - 24, BODY_TOP - 4, BODY_CX - 28, BODY_TOP + 6, BODY_CX - BODY_W / 2 - 2, BODY_TOP + 10)
      .fill({ color: c.acc, alpha: 0.7 });
    g.moveTo(BODY_CX + BODY_W / 2, BODY_TOP + 4)
      .bezierCurveTo(BODY_CX + 24, BODY_TOP - 4, BODY_CX + 28, BODY_TOP + 6, BODY_CX + BODY_W / 2 + 2, BODY_TOP + 10)
      .fill({ color: c.acc, alpha: 0.7 });
  } else if (accId.includes("backpack")) {
    g.roundRect(BODY_CX + BODY_W / 2 - 2, BODY_TOP, 10, 14, 4).fill(c.acc);
    g.roundRect(BODY_CX + BODY_W / 2 - 2, BODY_TOP, 10, 14, 4)
      .stroke({ color: darkenColor(c.acc, 0.2), width: OL * 0.5 });
    g.roundRect(BODY_CX + BODY_W / 2, BODY_TOP + 6, 6, 4, 1.5).fill(darkenColor(c.acc, 0.15));
  } else if (accId.includes("shield")) {
    g.ellipse(BODY_CX - BODY_W / 2 - 6, BODY_TOP + 6, 6, 8).fill(c.acc);
    g.ellipse(BODY_CX - BODY_W / 2 - 6, BODY_TOP + 6, 6, 8)
      .stroke({ color: darkenColor(c.acc, 0.2), width: OL * 0.5 });
  }
}

// ═══════════════════════════════════════════
// SITTING POSE — bent legs, resting arms
// ═══════════════════════════════════════════

function drawSittingLegs(g: Graphics, c: Colors, pantsId: string) {
  const isShorts = pantsId.includes("shorts");
  const isSkirt = pantsId.includes("skirt");
  const thighW = 12;
  const thighH = 7;

  if (isSkirt) {
    // Skirt draped over thighs
    g.moveTo(BODY_CX - BODY_W / 2, LEG_TOP)
      .lineTo(BODY_CX - BODY_W / 2 - 6, LEG_TOP + 8)
      .lineTo(BODY_CX + BODY_W / 2 + 6, LEG_TOP + 8)
      .lineTo(BODY_CX + BODY_W / 2, LEG_TOP).closePath().fill(c.pants);
    g.moveTo(BODY_CX - BODY_W / 2, LEG_TOP)
      .lineTo(BODY_CX - BODY_W / 2 - 6, LEG_TOP + 8)
      .lineTo(BODY_CX + BODY_W / 2 + 6, LEG_TOP + 8)
      .lineTo(BODY_CX + BODY_W / 2, LEG_TOP).closePath()
      .stroke({ color: c.outline, width: OL * 0.7 });
    // Calves below skirt
    g.roundRect(CX - 10, LEG_TOP + 8, 7, 6, 2).fill(c.skin);
    g.roundRect(CX + 3, LEG_TOP + 8, 7, 6, 2).fill(c.skin);
    return;
  }

  // Thighs (wider, going forward)
  g.roundRect(CX - 13, LEG_TOP, thighW, thighH, 3).fill(c.pants);
  g.roundRect(CX - 13, LEG_TOP, thighW, thighH, 3).stroke({ color: c.outline, width: OL * 0.7 });
  g.roundRect(CX + 1, LEG_TOP, thighW, thighH, 3).fill(c.pantsShade);
  g.roundRect(CX + 1, LEG_TOP, thighW, thighH, 3).stroke({ color: c.outline, width: OL * 0.7 });

  // Calves hanging down
  const calfTop = LEG_TOP + thighH - 2;
  const calfH = isShorts ? 5 : 7;
  const calfFill = isShorts ? c.skin : c.pants;
  const calfFillR = isShorts ? c.skin : c.pantsShade;

  g.roundRect(CX - 10, calfTop, 7, calfH, 2).fill(calfFill);
  g.roundRect(CX - 10, calfTop, 7, calfH, 2).stroke({ color: c.outline, width: OL * 0.6 });
  g.roundRect(CX + 3, calfTop, 7, calfH, 2).fill(calfFillR);
  g.roundRect(CX + 3, calfTop, 7, calfH, 2).stroke({ color: c.outline, width: OL * 0.6 });
}

function drawSittingShoes(g: Graphics, c: Colors, _shoesId: string) {
  const sy = LEG_TOP + 12;
  const sw = 9, sh = 4;

  g.roundRect(CX - 11, sy, sw, sh, 2).fill(c.shoes);
  g.roundRect(CX - 11, sy, sw, sh, 2).stroke({ color: c.outline, width: OL * 0.6 });
  g.roundRect(CX + 2, sy, sw, sh, 2).fill(c.shoesShade);
  g.roundRect(CX + 2, sy, sw, sh, 2).stroke({ color: c.outline, width: OL * 0.6 });
}

function drawSittingArms(g: Graphics, c: Colors) {
  const armY = BODY_TOP + 3;
  const armW = 7;
  const handR = 3;

  // Left arm — resting on thigh
  const lx = BODY_CX - BODY_W / 2 - armW + 2;
  g.roundRect(lx, armY, armW, ARM_LEN - 3, 3).fill(c.shirt);
  g.roundRect(lx, armY, armW, ARM_LEN - 3, 3).stroke({ color: c.outline, width: OL * 0.7 });
  g.circle(lx + armW / 2 + 1, armY + ARM_LEN - 2, handR).fill(c.skin);
  g.circle(lx + armW / 2 + 1, armY + ARM_LEN - 2, handR).stroke({ color: c.outline, width: OL * 0.6 });

  // Right arm — resting on thigh
  const rx = BODY_CX + BODY_W / 2 - 1;
  g.roundRect(rx, armY, armW, ARM_LEN - 3, 3).fill(c.shirtShade);
  g.roundRect(rx, armY, armW, ARM_LEN - 3, 3).stroke({ color: c.outline, width: OL * 0.7 });
  g.circle(rx + armW / 2 - 1, armY + ARM_LEN - 2, handR).fill(c.skinShade);
  g.circle(rx + armW / 2 - 1, armY + ARM_LEN - 2, handR).stroke({ color: c.outline, width: OL * 0.6 });
}

// ═══════════════════════════════════════════
// READING POSE — arms hold a book
// ═══════════════════════════════════════════

function drawReadingArms(g: Graphics, c: Colors) {
  const armY = BODY_TOP + 1;
  const armW = 7;
  const handR = 3;

  // Left arm — angled inward to hold book
  const lx = BODY_CX - BODY_W / 2 - armW + 3;
  g.roundRect(lx, armY, armW, ARM_LEN - 4, 3).fill(c.shirt);
  g.roundRect(lx, armY, armW, ARM_LEN - 4, 3).stroke({ color: c.outline, width: OL * 0.7 });
  g.circle(lx + armW - 1, armY + ARM_LEN - 5, handR).fill(c.skin);
  g.circle(lx + armW - 1, armY + ARM_LEN - 5, handR).stroke({ color: c.outline, width: OL * 0.6 });

  // Right arm — angled inward to hold book
  const rx = BODY_CX + BODY_W / 2 - 3;
  g.roundRect(rx, armY, armW, ARM_LEN - 4, 3).fill(c.shirtShade);
  g.roundRect(rx, armY, armW, ARM_LEN - 4, 3).stroke({ color: c.outline, width: OL * 0.7 });
  g.circle(rx + 1, armY + ARM_LEN - 5, handR).fill(c.skinShade);
  g.circle(rx + 1, armY + ARM_LEN - 5, handR).stroke({ color: c.outline, width: OL * 0.6 });
}

function drawBook(g: Graphics) {
  // Small book held in front at chest level
  const bx = CX - 6;
  const by = BODY_TOP + 3;
  const bw = 12;
  const bh = 9;

  // Book cover (blue)
  g.roundRect(bx, by, bw, bh, 1.5).fill(0x42a5f5);
  // Pages (white edge)
  g.roundRect(bx + bw - 2, by + 1, 2, bh - 2, 0.5).fill(0xfafafa);
  // Outline
  g.roundRect(bx, by, bw, bh, 1.5).stroke({ color: OL_COLOR, width: 1 });
  // Text lines
  g.moveTo(bx + 2, by + 2.5).lineTo(bx + bw - 3, by + 2.5).stroke({ color: 0x1565c0, width: 0.5 });
  g.moveTo(bx + 2, by + 4.5).lineTo(bx + bw - 3, by + 4.5).stroke({ color: 0x1565c0, width: 0.5 });
  g.moveTo(bx + 2, by + 6.5).lineTo(bx + bw - 4, by + 6.5).stroke({ color: 0x1565c0, width: 0.5 });
}

// ═══════════════════════════════════════════
// ACCESSORIES
// ═══════════════════════════════════════════

function drawAccessoryFront(g: Graphics, accId: string | null, c: Colors) {
  if (!accId) return;
  if (accId.includes("sword")) {
    const sx = BODY_CX + BODY_W / 2 + 6;
    g.roundRect(sx - 1, HEAD_CY, 2, 28, 0.5).fill(0xc0c0c0);
    g.roundRect(sx - 1, HEAD_CY, 2, 28, 0.5).stroke({ color: 0x808080, width: 0.7 });
    g.roundRect(sx - 4, BODY_TOP + 2, 8, 2, 1).fill(0xffd700);
    g.roundRect(sx - 1, BODY_TOP + 4, 2, 6, 0.5).fill(0x8d6e63);
  } else if (accId.includes("pet_cat")) {
    const px = BODY_CX + 20, py = LEG_TOP + LEG_LEN;
    g.circle(px, py - 4, 4).fill(c.acc);
    g.ellipse(px, py + 1, 4, 3).fill(c.acc);
    g.moveTo(px - 4, py - 7).lineTo(px - 2, py - 10).lineTo(px, py - 7).fill(c.acc);
    g.moveTo(px, py - 7).lineTo(px + 2, py - 10).lineTo(px + 4, py - 7).fill(c.acc);
    g.circle(px - 1.5, py - 4.5, 0.8).fill(c.outline);
    g.circle(px + 1.5, py - 4.5, 0.8).fill(c.outline);
    g.moveTo(px + 4, py + 1).bezierCurveTo(px + 8, py, px + 8, py - 4, px + 6, py - 6)
      .stroke({ color: c.acc, width: 1.5 });
  } else if (accId.includes("pet_dog")) {
    const px = BODY_CX + 20, py = LEG_TOP + LEG_LEN;
    g.circle(px, py - 4, 4.5).fill(c.acc);
    g.ellipse(px, py + 1, 4.5, 3).fill(c.acc);
    g.ellipse(px - 5, py - 2, 2.5, 4).fill(darkenColor(c.acc, 0.2));
    g.ellipse(px + 5, py - 2, 2.5, 4).fill(darkenColor(c.acc, 0.2));
    g.circle(px - 1.5, py - 5, 0.8).fill(c.outline);
    g.circle(px + 1.5, py - 5, 0.8).fill(c.outline);
    g.ellipse(px, py - 2, 1.2, 0.8).fill(0xff8a80);
  }
}
