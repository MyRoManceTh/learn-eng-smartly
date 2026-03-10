/**
 * Chibi Character Renderer - Claw-Empire Style
 *
 * Draws detailed chibi characters using PixiJS Graphics shapes
 * (circles, roundRects, bezier curves) instead of pixel grids.
 *
 * Design space: 200 x 260 units, scaled to fit canvas.
 * Chibi proportions: big head (~40%), small body (~35%), short legs (~25%)
 */
import { Container, Graphics } from "pixi.js";
import { EquippedItems } from "@/types/avatar";
import { getItemById } from "@/data/avatarItems";
import { parseColor, darkenColor, lightenColor, blendColor } from "./colorUtils";

// ─── Design constants (in design-space units) ───
const DW = 200; // design width
const DH = 260; // design height
const CX = DW / 2; // center X

// ─── Body proportions ───
const HEAD_R = 38;  // head radius
const HEAD_CY = 70; // head center Y
const BODY_W = 52;  // body width
const BODY_H = 58;  // body height
const BODY_Y = 108; // body top Y
const ARM_W = 16;
const ARM_H = 50;
const LEG_W = 20;
const LEG_H = 48;
const LEG_GAP = 8;
const SHOE_H = 14;
const FOOT_W = 24;

interface Colors {
  skin: number;
  skinShadow: number;
  skinHighlight: number;
  hair: number;
  hairShadow: number;
  hairHighlight: number;
  shirt: number;
  shirtShadow: number;
  shirtHighlight: number;
  pants: number;
  pantsShadow: number;
  shoes: number;
  shoesShadow: number;
  hat: number | null;
  hatShadow: number | null;
  hatHighlight: number | null;
  accColor: number;
  outline: number;
  eye: number;
}

function resolveColors(equipped: EquippedItems): Colors {
  const skinItem = getItemById(equipped.skin);
  const hairColorItem = getItemById(equipped.hairColor);
  const shirtItem = getItemById(equipped.shirt);
  const pantsItem = getItemById(equipped.pants);
  const shoesItem = getItemById(equipped.shoes);
  const hatItem = equipped.hat ? getItemById(equipped.hat) : null;
  const accItem = equipped.accessory ? getItemById(equipped.accessory) : null;

  const skin = parseColor(skinItem?.svgProps?.color || "#F5D5C0");
  const hair = parseColor(hairColorItem?.svgProps?.color || "#2C2C2C");
  const shirt = parseColor(shirtItem?.svgProps?.color || "#4DB6AC");
  const pants = parseColor(pantsItem?.svgProps?.color || "#4A90E2");
  const shoes = parseColor(shoesItem?.svgProps?.color || "#F0F0F0");
  const hat = hatItem ? parseColor(hatItem.svgProps?.color || "#E53935") : null;

  return {
    skin,
    skinShadow: darkenColor(skin, 0.18),
    skinHighlight: lightenColor(skin, 0.12),
    hair,
    hairShadow: darkenColor(hair, 0.2),
    hairHighlight: lightenColor(hair, 0.2),
    shirt,
    shirtShadow: darkenColor(shirt, 0.18),
    shirtHighlight: lightenColor(shirt, 0.12),
    pants,
    pantsShadow: darkenColor(pants, 0.18),
    shoes,
    shoesShadow: darkenColor(shoes, 0.22),
    hat,
    hatShadow: hat ? darkenColor(hat, 0.2) : null,
    hatHighlight: hat ? lightenColor(hat, 0.15) : null,
    accColor: accItem ? parseColor(accItem.svgProps?.color || "#80DEEA") : 0x80deea,
    outline: 0x2a1f3d,
    eye: 0x1a1a2e,
  };
}

// ─── Main Draw Function ───
export function drawChibiCharacter(
  container: Container,
  equipped: EquippedItems,
  canvasSize: number
): void {
  container.removeChildren();

  const scale = canvasSize / DH;
  const c = resolveColors(equipped);

  const hairItem = getItemById(equipped.hair);
  const hairStyle = hairItem?.svgProps?.path || "short";
  const shirtPattern = getShirtPattern(equipped.shirt);
  const pantsStyle = getPantsStyle(equipped.pants);
  const shoeStyle = getShoeStyle(equipped.shoes);

  // Offset X to center character in square canvas
  const offsetX = (canvasSize - DW * scale) / 2;

  const root = new Container();
  root.scale.set(scale);
  root.position.set(offsetX / scale, 0);

  // Layer order (back to front)
  drawShadow(root, c);
  drawAccessoryBack(root, equipped.accessory, c);
  drawHairBack(root, hairStyle, c, !!equipped.hat);
  drawLegs(root, pantsStyle, c);
  drawShoes(root, shoeStyle, c);
  drawBody(root, shirtPattern, c);
  drawArms(root, c);
  drawNeck(root, c);
  drawHead(root, c);
  drawFace(root, c, equipped);
  drawHairFront(root, hairStyle, c, !!equipped.hat);
  drawHat(root, equipped.hat, c);
  drawAccessoryFront(root, equipped.accessory, c);

  container.addChild(root);
}

// ─── SHADOW ───
function drawShadow(parent: Container, c: Colors) {
  const g = new Graphics();
  g.ellipse(CX, 252, 36, 8).fill({ color: 0x000000, alpha: 0.12 });
  g.ellipse(CX, 252, 30, 6).fill({ color: 0x000000, alpha: 0.08 });
  parent.addChild(g);
}

// ─── HEAD ───
function drawHead(parent: Container, c: Colors) {
  const g = new Graphics();

  // Outline
  g.circle(CX, HEAD_CY, HEAD_R + 2).fill(c.outline);

  // Main head
  g.circle(CX, HEAD_CY, HEAD_R).fill(c.skin);

  // Shading: right side shadow
  g.ellipse(CX + 14, HEAD_CY + 4, HEAD_R * 0.6, HEAD_R * 0.85)
    .fill({ color: c.skinShadow, alpha: 0.35 });

  // Highlight: top-left
  g.ellipse(CX - 12, HEAD_CY - 10, 14, 12)
    .fill({ color: c.skinHighlight, alpha: 0.3 });

  // Cheek blush
  g.ellipse(CX - 22, HEAD_CY + 10, 8, 5).fill({ color: 0xffb4b4, alpha: 0.5 });
  g.ellipse(CX + 22, HEAD_CY + 10, 8, 5).fill({ color: 0xffb4b4, alpha: 0.5 });

  parent.addChild(g);
}

// ─── FACE ───
function drawFace(parent: Container, c: Colors, equipped: EquippedItems) {
  const g = new Graphics();
  const eyeY = HEAD_CY + 2;
  const eyeSpacing = 16;
  const hasGlasses = equipped.accessory === "acc_glasses";

  // Eyes - big expressive chibi eyes
  // Left eye
  drawEye(g, CX - eyeSpacing, eyeY, c, false);
  // Right eye
  drawEye(g, CX + eyeSpacing, eyeY, c, true);

  // Mouth - cute small smile
  g.moveTo(CX - 5, HEAD_CY + 16)
    .quadraticCurveTo(CX, HEAD_CY + 21, CX + 5, HEAD_CY + 16)
    .stroke({ color: c.outline, alpha: 0.6, width: 1.8 });

  // Glasses
  if (hasGlasses) {
    drawGlasses(g, c);
  }

  parent.addChild(g);
}

function drawEye(g: Graphics, x: number, y: number, c: Colors, isRight: boolean) {
  // White area
  g.roundRect(x - 8, y - 7, 16, 14, 5).fill(0xffffff);

  // Iris (dark)
  const pupilX = isRight ? x + 1 : x - 1;
  g.circle(pupilX, y, 5.5).fill(c.eye);

  // Pupil highlight (white dot)
  g.circle(pupilX - 2, y - 2, 2).fill(0xffffff);

  // Small secondary highlight
  g.circle(pupilX + 1.5, y + 1.5, 1).fill({ color: 0xffffff, alpha: 0.6 });

  // Eye outline
  g.roundRect(x - 8, y - 7, 16, 14, 5)
    .stroke({ color: c.outline, width: 1.5 });
}

function drawGlasses(g: Graphics, c: Colors) {
  const eyeY = HEAD_CY + 2;
  // Left lens
  g.roundRect(CX - 26, eyeY - 10, 22, 18, 4)
    .stroke({ color: c.accColor, width: 2.5 });
  // Right lens
  g.roundRect(CX + 4, eyeY - 10, 22, 18, 4)
    .stroke({ color: c.accColor, width: 2.5 });
  // Bridge
  g.moveTo(CX - 4, eyeY)
    .lineTo(CX + 4, eyeY)
    .stroke({ color: c.accColor, width: 2 });
  // Temples
  g.moveTo(CX - 26, eyeY - 2).lineTo(CX - 38, eyeY - 5)
    .stroke({ color: c.accColor, width: 1.5 });
  g.moveTo(CX + 26, eyeY - 2).lineTo(CX + 38, eyeY - 5)
    .stroke({ color: c.accColor, width: 1.5 });
}

// ─── NECK ───
function drawNeck(parent: Container, c: Colors) {
  const g = new Graphics();
  g.roundRect(CX - 8, HEAD_CY + HEAD_R - 4, 16, 14, 3).fill(c.outline);
  g.roundRect(CX - 6, HEAD_CY + HEAD_R - 3, 12, 12, 2).fill(c.skin);
  g.roundRect(CX - 6, HEAD_CY + HEAD_R - 3, 12, 12, 2)
    .fill({ color: c.skinShadow, alpha: 0.2 });
  parent.addChild(g);
}

// ─── BODY / SHIRT ───
function drawBody(parent: Container, pattern: string, c: Colors) {
  const g = new Graphics();
  const bx = CX - BODY_W / 2;

  // Outline
  g.roundRect(bx - 2, BODY_Y - 2, BODY_W + 4, BODY_H + 4, 10).fill(c.outline);

  // Main body
  g.roundRect(bx, BODY_Y, BODY_W, BODY_H, 8).fill(c.shirt);

  // Shading: right side
  g.roundRect(CX + 4, BODY_Y + 4, BODY_W / 2 - 4, BODY_H - 8, 6)
    .fill({ color: c.shirtShadow, alpha: 0.35 });

  // Highlight: top-left
  g.roundRect(bx + 4, BODY_Y + 4, 16, 20, 5)
    .fill({ color: c.shirtHighlight, alpha: 0.25 });

  // Collar
  g.moveTo(CX - 12, BODY_Y + 2)
    .quadraticCurveTo(CX, BODY_Y + 10, CX + 12, BODY_Y + 2)
    .stroke({ color: c.shirtShadow, width: 2 });

  // Apply shirt pattern
  applyShirtDetail(g, pattern, c);

  parent.addChild(g);
}

function applyShirtDetail(g: Graphics, pattern: string, c: Colors) {
  const bx = CX - BODY_W / 2;
  switch (pattern) {
    case "stripes":
      for (let i = 0; i < 4; i++) {
        const y = BODY_Y + 14 + i * 12;
        g.roundRect(bx + 6, y, BODY_W - 12, 4, 2)
          .fill({ color: c.shirtShadow, alpha: 0.4 });
      }
      break;
    case "hero": {
      // Star emblem on chest
      const sx = CX, sy = BODY_Y + 28;
      g.star(sx, sy, 5, 10, 5, 0).fill({ color: 0xffd700, alpha: 0.8 });
      g.star(sx, sy, 5, 10, 5, 0).stroke({ color: 0xffab00, width: 1 });
      break;
    }
    case "hoodie": {
      // Hood outline behind neck
      g.roundRect(CX - 20, BODY_Y - 4, 40, 14, 8)
        .fill(c.shirtShadow);
      // Zipper line
      g.moveTo(CX, BODY_Y + 8).lineTo(CX, BODY_Y + BODY_H - 4)
        .stroke({ color: c.shirtShadow, width: 2 });
      // Pocket
      g.roundRect(bx + 8, BODY_Y + 34, BODY_W - 16, 12, 4)
        .stroke({ color: c.shirtShadow, width: 1.5 });
      break;
    }
    case "tuxedo": {
      // White shirt center
      g.roundRect(CX - 8, BODY_Y + 8, 16, BODY_H - 14, 3).fill(0xf0f0f0);
      // Lapels
      g.moveTo(CX - 8, BODY_Y + 8).lineTo(CX - 18, BODY_Y + 24)
        .stroke({ color: darkenColor(c.shirt, 0.3), width: 2.5 });
      g.moveTo(CX + 8, BODY_Y + 8).lineTo(CX + 18, BODY_Y + 24)
        .stroke({ color: darkenColor(c.shirt, 0.3), width: 2.5 });
      // Bow tie
      g.star(CX, BODY_Y + 6, 4, 5, 2.5, Math.PI / 4)
        .fill(0xd32f2f);
      break;
    }
    case "dragon": {
      // Scale pattern
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
          const px = bx + 8 + col * 10 + (row % 2) * 5;
          const py = BODY_Y + 12 + row * 14;
          g.ellipse(px, py, 5, 4)
            .fill({ color: lightenColor(c.shirt, 0.2), alpha: 0.4 });
        }
      }
      // Dragon emblem
      g.circle(CX, BODY_Y + 30, 6).fill({ color: 0xffd700, alpha: 0.7 });
      g.circle(CX, BODY_Y + 30, 3).fill({ color: 0xff6d00, alpha: 0.8 });
      break;
    }
    case "galaxy": {
      // Stars/sparkles
      const stars = [[CX - 14, BODY_Y + 16], [CX + 10, BODY_Y + 22],
        [CX - 8, BODY_Y + 36], [CX + 16, BODY_Y + 40], [CX, BODY_Y + 48]];
      for (const [sx, sy] of stars) {
        g.star(sx, sy, 4, 2.5, 1, 0).fill({ color: 0xffffff, alpha: 0.7 });
      }
      // Nebula glow
      g.ellipse(CX, BODY_Y + 30, 18, 14)
        .fill({ color: 0x7c4dff, alpha: 0.15 });
      break;
    }
  }
}

// ─── ARMS ───
function drawArms(parent: Container, c: Colors) {
  const g = new Graphics();

  // Left arm
  const lx = CX - BODY_W / 2 - ARM_W + 4;
  const armY = BODY_Y + 4;
  // Outline
  g.roundRect(lx - 1, armY - 1, ARM_W + 2, ARM_H + 2, 7).fill(c.outline);
  // Sleeve
  g.roundRect(lx, armY, ARM_W, ARM_H * 0.55, 6).fill(c.shirt);
  g.roundRect(lx, armY, ARM_W, ARM_H * 0.55, 6)
    .fill({ color: c.shirtShadow, alpha: 0.15 });
  // Skin (forearm)
  g.roundRect(lx, armY + ARM_H * 0.45, ARM_W, ARM_H * 0.55, 6).fill(c.skin);
  // Hand
  g.circle(lx + ARM_W / 2, armY + ARM_H - 2, ARM_W / 2 + 1).fill(c.outline);
  g.circle(lx + ARM_W / 2, armY + ARM_H - 2, ARM_W / 2).fill(c.skin);

  // Right arm (mirrored, slightly darker for depth)
  const rx = CX + BODY_W / 2 - 4;
  g.roundRect(rx - 1, armY - 1, ARM_W + 2, ARM_H + 2, 7).fill(c.outline);
  g.roundRect(rx, armY, ARM_W, ARM_H * 0.55, 6).fill(c.shirt);
  g.roundRect(rx, armY, ARM_W, ARM_H * 0.55, 6)
    .fill({ color: c.shirtShadow, alpha: 0.3 });
  g.roundRect(rx, armY + ARM_H * 0.45, ARM_W, ARM_H * 0.55, 6).fill(c.skin);
  g.roundRect(rx, armY + ARM_H * 0.45, ARM_W, ARM_H * 0.55, 6)
    .fill({ color: c.skinShadow, alpha: 0.15 });
  g.circle(rx + ARM_W / 2, armY + ARM_H - 2, ARM_W / 2 + 1).fill(c.outline);
  g.circle(rx + ARM_W / 2, armY + ARM_H - 2, ARM_W / 2).fill(c.skinShadow);

  parent.addChild(g);
}

// ─── LEGS ───
function drawLegs(parent: Container, style: string, c: Colors) {
  const g = new Graphics();
  const legY = BODY_Y + BODY_H - 6;

  // Left leg
  const llx = CX - LEG_GAP / 2 - LEG_W;
  g.roundRect(llx - 1, legY - 1, LEG_W + 2, LEG_H + 2, 6).fill(c.outline);

  if (style === "skirt") {
    // Skirt
    g.moveTo(CX - BODY_W / 2 + 2, legY)
      .lineTo(CX - BODY_W / 2 - 6, legY + 28)
      .lineTo(CX + BODY_W / 2 + 6, legY + 28)
      .lineTo(CX + BODY_W / 2 - 2, legY)
      .fill(c.pants);
    g.moveTo(CX - BODY_W / 2 + 2, legY)
      .lineTo(CX - BODY_W / 2 - 6, legY + 28)
      .lineTo(CX + BODY_W / 2 + 6, legY + 28)
      .lineTo(CX + BODY_W / 2 - 2, legY)
      .stroke({ color: c.outline, width: 2 });
    // Legs showing below skirt
    g.roundRect(llx, legY + 22, LEG_W, LEG_H - 22, 5).fill(c.skin);
    const rlx = CX + LEG_GAP / 2;
    g.roundRect(rlx, legY + 22, LEG_W, LEG_H - 22, 5).fill(c.skin);
    g.roundRect(rlx, legY + 22, LEG_W, LEG_H - 22, 5)
      .fill({ color: c.skinShadow, alpha: 0.15 });
  } else {
    const pantsH = style === "shorts" ? LEG_H * 0.5 : LEG_H;
    // Left leg
    g.roundRect(llx, legY, LEG_W, pantsH, 5).fill(c.pants);
    if (style === "shorts") {
      g.roundRect(llx, legY + pantsH - 2, LEG_W, LEG_H - pantsH + 2, 5).fill(c.skin);
    }
    // Right leg
    const rlx = CX + LEG_GAP / 2;
    g.roundRect(rlx - 1, legY - 1, LEG_W + 2, LEG_H + 2, 6).fill(c.outline);
    g.roundRect(rlx, legY, LEG_W, pantsH, 5).fill(c.pants);
    g.roundRect(rlx, legY, LEG_W, pantsH, 5)
      .fill({ color: c.pantsShadow, alpha: 0.2 });
    if (style === "shorts") {
      g.roundRect(rlx, legY + pantsH - 2, LEG_W, LEG_H - pantsH + 2, 5).fill(c.skin);
      g.roundRect(rlx, legY + pantsH - 2, LEG_W, LEG_H - pantsH + 2, 5)
        .fill({ color: c.skinShadow, alpha: 0.15 });
    }
  }

  parent.addChild(g);
}

// ─── SHOES ───
function drawShoes(parent: Container, style: string, c: Colors) {
  const g = new Graphics();
  const shoeY = BODY_Y + BODY_H + LEG_H - 10;

  const lsx = CX - LEG_GAP / 2 - FOOT_W + 2;
  const rsx = CX + LEG_GAP / 2 - 2;

  if (style === "rocket") {
    // Rocket boots - bigger, with flame
    drawRocketBoot(g, lsx, shoeY, c, false);
    drawRocketBoot(g, rsx, shoeY, c, true);
  } else if (style === "heels") {
    drawHeel(g, lsx, shoeY, c, false);
    drawHeel(g, rsx, shoeY, c, true);
  } else if (style === "boots") {
    // Taller boots
    drawBoot(g, lsx, shoeY - 8, c, false);
    drawBoot(g, rsx, shoeY - 8, c, true);
  } else if (style === "cloud") {
    drawCloudShoe(g, lsx, shoeY, c, false);
    drawCloudShoe(g, rsx, shoeY, c, true);
  } else {
    // Sneakers (default)
    g.roundRect(lsx - 1, shoeY - 1, FOOT_W + 2, SHOE_H + 2, 5).fill(c.outline);
    g.roundRect(lsx, shoeY, FOOT_W, SHOE_H, 4).fill(c.shoes);
    g.roundRect(lsx, shoeY + SHOE_H - 4, FOOT_W, 4, 2).fill(c.shoesShadow);

    g.roundRect(rsx - 1, shoeY - 1, FOOT_W + 2, SHOE_H + 2, 5).fill(c.outline);
    g.roundRect(rsx, shoeY, FOOT_W, SHOE_H, 4).fill(c.shoes);
    g.roundRect(rsx, shoeY, FOOT_W, SHOE_H, 4)
      .fill({ color: c.shoesShadow, alpha: 0.25 });
    g.roundRect(rsx, shoeY + SHOE_H - 4, FOOT_W, 4, 2).fill(c.shoesShadow);
  }

  parent.addChild(g);
}

function drawRocketBoot(g: Graphics, x: number, y: number, c: Colors, isRight: boolean) {
  g.roundRect(x - 1, y - 5, FOOT_W + 2, SHOE_H + 8, 5).fill(c.outline);
  g.roundRect(x, y - 4, FOOT_W, SHOE_H + 6, 4).fill(c.shoes);
  // Flame
  g.ellipse(x + FOOT_W / 2, y + SHOE_H + 4, 6, 8)
    .fill({ color: 0xff6d00, alpha: 0.8 });
  g.ellipse(x + FOOT_W / 2, y + SHOE_H + 2, 4, 5)
    .fill({ color: 0xffab00, alpha: 0.9 });
}

function drawHeel(g: Graphics, x: number, y: number, c: Colors, isRight: boolean) {
  g.roundRect(x - 1, y - 1, FOOT_W + 2, SHOE_H + 2, 4).fill(c.outline);
  g.roundRect(x, y, FOOT_W, SHOE_H, 3).fill(c.shoes);
  // Heel
  g.roundRect(x + FOOT_W - 6, y + SHOE_H - 2, 6, 8, 2).fill(c.outline);
  g.roundRect(x + FOOT_W - 5, y + SHOE_H - 1, 4, 6, 1).fill(c.shoes);
}

function drawBoot(g: Graphics, x: number, y: number, c: Colors, isRight: boolean) {
  g.roundRect(x - 1, y - 1, FOOT_W + 2, SHOE_H + 12, 5).fill(c.outline);
  g.roundRect(x, y, FOOT_W, SHOE_H + 10, 4).fill(c.shoes);
  // Boot cuff
  g.roundRect(x, y, FOOT_W, 6, 3).fill(c.shoesShadow);
  if (isRight) {
    g.roundRect(x, y, FOOT_W, SHOE_H + 10, 4)
      .fill({ color: c.shoesShadow, alpha: 0.2 });
  }
}

function drawCloudShoe(g: Graphics, x: number, y: number, c: Colors, isRight: boolean) {
  g.roundRect(x, y, FOOT_W, SHOE_H, 4).fill(c.shoes);
  // Cloud puffs
  g.circle(x + 4, y + SHOE_H, 6).fill({ color: 0xe3f2fd, alpha: 0.8 });
  g.circle(x + FOOT_W / 2, y + SHOE_H + 2, 7).fill({ color: 0xe3f2fd, alpha: 0.8 });
  g.circle(x + FOOT_W - 4, y + SHOE_H, 6).fill({ color: 0xbbdefb, alpha: 0.7 });
}

// ─── HAIR (back layer - drawn behind head) ───
function drawHairBack(parent: Container, style: string, c: Colors, hasHat: boolean) {
  if (hasHat) return;
  const g = new Graphics();

  if (style === "long" || style === "ponytail") {
    // Long hair falling behind
    g.roundRect(CX - 42, HEAD_CY - 10, 84, 100, 20).fill(c.outline);
    g.roundRect(CX - 40, HEAD_CY - 8, 80, 96, 18).fill(c.hair);
    g.roundRect(CX - 40, HEAD_CY - 8, 80, 96, 18)
      .fill({ color: c.hairShadow, alpha: 0.2 });
  }

  if (style === "cape_hair" || style === "afro") {
    // Big volume behind
    g.circle(CX, HEAD_CY - 4, HEAD_R + 20).fill(c.outline);
    g.circle(CX, HEAD_CY - 4, HEAD_R + 18).fill(c.hair);
  }

  parent.addChild(g);
}

// ─── HAIR (front layer - drawn on top of head) ───
function drawHairFront(parent: Container, style: string, c: Colors, hasHat: boolean) {
  if (hasHat) return;
  const g = new Graphics();

  switch (style) {
    case "short":
      drawShortHair(g, c);
      break;
    case "long":
      drawLongHair(g, c);
      break;
    case "ponytail":
      drawPonytailHair(g, c);
      break;
    case "bun":
      drawBunHair(g, c);
      break;
    case "curly":
      drawCurlyHair(g, c);
      break;
    case "spike":
      drawSpikeHair(g, c);
      break;
    case "afro":
      drawAfroHair(g, c);
      break;
    case "mohawk":
      drawMohawkHair(g, c);
      break;
    default:
      drawShortHair(g, c);
  }

  parent.addChild(g);
}

function drawShortHair(g: Graphics, c: Colors) {
  // Top cap
  g.ellipse(CX, HEAD_CY - 20, HEAD_R + 4, 22).fill(c.outline);
  g.ellipse(CX, HEAD_CY - 20, HEAD_R + 2, 20).fill(c.hair);
  // Fringe/bangs
  g.ellipse(CX - 10, HEAD_CY - HEAD_R + 8, 22, 14).fill(c.hair);
  g.ellipse(CX + 8, HEAD_CY - HEAD_R + 10, 18, 12).fill(c.hair);
  // Side tufts
  g.ellipse(CX - HEAD_R - 2, HEAD_CY - 6, 10, 16).fill(c.outline);
  g.ellipse(CX - HEAD_R - 1, HEAD_CY - 6, 8, 14).fill(c.hair);
  g.ellipse(CX + HEAD_R + 2, HEAD_CY - 6, 10, 16).fill(c.outline);
  g.ellipse(CX + HEAD_R + 1, HEAD_CY - 6, 8, 14).fill(c.hair);
  // Highlight
  g.ellipse(CX - 8, HEAD_CY - 28, 10, 6)
    .fill({ color: c.hairHighlight, alpha: 0.4 });
}

function drawLongHair(g: Graphics, c: Colors) {
  // Top
  g.ellipse(CX, HEAD_CY - 22, HEAD_R + 6, 24).fill(c.outline);
  g.ellipse(CX, HEAD_CY - 22, HEAD_R + 4, 22).fill(c.hair);
  // Bangs
  g.ellipse(CX - 12, HEAD_CY - HEAD_R + 8, 24, 16).fill(c.hair);
  g.ellipse(CX + 6, HEAD_CY - HEAD_R + 10, 20, 14).fill(c.hair);
  // Side curtains
  g.roundRect(CX - HEAD_R - 8, HEAD_CY - 12, 14, 70, 6).fill(c.outline);
  g.roundRect(CX - HEAD_R - 6, HEAD_CY - 10, 10, 66, 4).fill(c.hair);
  g.roundRect(CX + HEAD_R - 4, HEAD_CY - 12, 14, 70, 6).fill(c.outline);
  g.roundRect(CX + HEAD_R - 2, HEAD_CY - 10, 10, 66, 4).fill(c.hair);
  g.roundRect(CX + HEAD_R - 2, HEAD_CY - 10, 10, 66, 4)
    .fill({ color: c.hairShadow, alpha: 0.2 });
  // Highlight
  g.ellipse(CX - 10, HEAD_CY - 30, 12, 7)
    .fill({ color: c.hairHighlight, alpha: 0.4 });
}

function drawPonytailHair(g: Graphics, c: Colors) {
  // Base similar to short
  drawShortHair(g, c);
  // Ponytail going right-back
  g.roundRect(CX + HEAD_R - 4, HEAD_CY - 10, 12, 60, 6).fill(c.outline);
  g.roundRect(CX + HEAD_R - 2, HEAD_CY - 8, 8, 56, 4).fill(c.hair);
  // Hair tie
  g.roundRect(CX + HEAD_R - 4, HEAD_CY - 12, 12, 6, 3).fill(0xe91e63);
}

function drawBunHair(g: Graphics, c: Colors) {
  drawShortHair(g, c);
  // Bun on top
  g.circle(CX + 4, HEAD_CY - HEAD_R - 10, 14).fill(c.outline);
  g.circle(CX + 4, HEAD_CY - HEAD_R - 10, 12).fill(c.hair);
  g.circle(CX + 2, HEAD_CY - HEAD_R - 14, 4)
    .fill({ color: c.hairHighlight, alpha: 0.4 });
}

function drawCurlyHair(g: Graphics, c: Colors) {
  // Voluminous curly hair
  g.ellipse(CX, HEAD_CY - 16, HEAD_R + 10, 28).fill(c.outline);
  g.ellipse(CX, HEAD_CY - 16, HEAD_R + 8, 26).fill(c.hair);
  // Curly bumps
  const bumpR = 8;
  for (let angle = -2.5; angle <= 2.5; angle += 0.8) {
    const bx = CX + Math.sin(angle) * (HEAD_R + 4);
    const by = HEAD_CY - 4 + Math.cos(angle) * 14;
    g.circle(bx, by, bumpR).fill(c.outline);
    g.circle(bx, by, bumpR - 1.5).fill(c.hair);
  }
  // Side volume
  g.ellipse(CX - HEAD_R - 6, HEAD_CY, 12, 22).fill(c.outline);
  g.ellipse(CX - HEAD_R - 4, HEAD_CY, 10, 20).fill(c.hair);
  g.ellipse(CX + HEAD_R + 6, HEAD_CY, 12, 22).fill(c.outline);
  g.ellipse(CX + HEAD_R + 4, HEAD_CY, 10, 20).fill(c.hair);
  // Highlight
  g.ellipse(CX - 6, HEAD_CY - 30, 10, 6)
    .fill({ color: c.hairHighlight, alpha: 0.5 });
}

function drawSpikeHair(g: Graphics, c: Colors) {
  // Base
  g.ellipse(CX, HEAD_CY - 20, HEAD_R + 2, 20).fill(c.hair);
  // Spikes pointing up
  const spikes = [
    { x: CX - 20, y: HEAD_CY - 48, r: -0.3 },
    { x: CX - 6, y: HEAD_CY - 55, r: -0.1 },
    { x: CX + 8, y: HEAD_CY - 52, r: 0.15 },
    { x: CX + 22, y: HEAD_CY - 44, r: 0.3 },
  ];
  for (const spike of spikes) {
    g.moveTo(spike.x - 10, HEAD_CY - HEAD_R + 6)
      .lineTo(spike.x, spike.y)
      .lineTo(spike.x + 10, HEAD_CY - HEAD_R + 6)
      .fill(c.outline);
    g.moveTo(spike.x - 8, HEAD_CY - HEAD_R + 8)
      .lineTo(spike.x, spike.y + 3)
      .lineTo(spike.x + 8, HEAD_CY - HEAD_R + 8)
      .fill(c.hair);
  }
  // Side tufts
  g.ellipse(CX - HEAD_R, HEAD_CY - 4, 8, 14).fill(c.hair);
  g.ellipse(CX + HEAD_R, HEAD_CY - 4, 8, 14).fill(c.hair);
  // Highlight on tips
  for (const spike of spikes) {
    g.ellipse(spike.x, spike.y + 6, 4, 5)
      .fill({ color: c.hairHighlight, alpha: 0.5 });
  }
}

function drawAfroHair(g: Graphics, c: Colors) {
  const afroR = HEAD_R + 22;
  // Big round afro
  g.circle(CX, HEAD_CY - 6, afroR + 2).fill(c.outline);
  g.circle(CX, HEAD_CY - 6, afroR).fill(c.hair);
  // Volume bumps
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const bx = CX + Math.cos(angle) * (afroR - 4);
    const by = HEAD_CY - 6 + Math.sin(angle) * (afroR - 4);
    g.circle(bx, by, 10).fill(c.hair);
  }
  // Highlight
  g.ellipse(CX - 14, HEAD_CY - 30, 16, 10)
    .fill({ color: c.hairHighlight, alpha: 0.35 });
}

function drawMohawkHair(g: Graphics, c: Colors) {
  // Shaved sides
  g.ellipse(CX - HEAD_R, HEAD_CY - 4, 6, 12).fill(c.outline);
  g.ellipse(CX - HEAD_R + 1, HEAD_CY - 4, 4, 10).fill(c.skinShadow);
  g.ellipse(CX + HEAD_R, HEAD_CY - 4, 6, 12).fill(c.outline);
  g.ellipse(CX + HEAD_R - 1, HEAD_CY - 4, 4, 10).fill(c.skinShadow);
  // Mohawk strip
  g.roundRect(CX - 10, HEAD_CY - 58, 20, 50, 6).fill(c.outline);
  g.roundRect(CX - 8, HEAD_CY - 56, 16, 46, 4).fill(c.hair);
  // Highlight
  g.ellipse(CX - 2, HEAD_CY - 48, 5, 10)
    .fill({ color: c.hairHighlight, alpha: 0.5 });
}

// ─── HATS ───
function drawHat(parent: Container, hatId: string | null, c: Colors) {
  if (!hatId || !c.hat) return;
  const g = new Graphics();
  const hat = c.hat;
  const shadow = c.hatShadow!;
  const hl = c.hatHighlight!;

  if (hatId.includes("baseball")) {
    g.ellipse(CX, HEAD_CY - HEAD_R + 6, HEAD_R + 8, 18).fill(c.outline);
    g.ellipse(CX, HEAD_CY - HEAD_R + 6, HEAD_R + 6, 16).fill(hat);
    g.ellipse(CX - 4, HEAD_CY - HEAD_R + 2, HEAD_R - 4, 8)
      .fill({ color: hl, alpha: 0.3 });
    // Brim
    g.ellipse(CX - 6, HEAD_CY - HEAD_R + 20, HEAD_R + 12, 8).fill(c.outline);
    g.ellipse(CX - 6, HEAD_CY - HEAD_R + 20, HEAD_R + 10, 6).fill(shadow);
  } else if (hatId.includes("beanie")) {
    g.ellipse(CX, HEAD_CY - HEAD_R + 2, HEAD_R + 6, 22).fill(c.outline);
    g.ellipse(CX, HEAD_CY - HEAD_R + 2, HEAD_R + 4, 20).fill(hat);
    // Pompom
    g.circle(CX, HEAD_CY - HEAD_R - 14, 8).fill(c.outline);
    g.circle(CX, HEAD_CY - HEAD_R - 14, 6).fill(hl);
    // Ribbed edge
    g.roundRect(CX - HEAD_R - 4, HEAD_CY - HEAD_R + 14, HEAD_R * 2 + 8, 8, 3)
      .fill(shadow);
  } else if (hatId.includes("crown")) {
    // Crown with jewels
    const crY = HEAD_CY - HEAD_R - 4;
    g.roundRect(CX - 22, crY, 44, 20, 3).fill(c.outline);
    g.roundRect(CX - 20, crY + 2, 40, 16, 2).fill(hat);
    // Points
    for (const px of [-16, -4, 8, 20]) {
      g.moveTo(CX + px - 6, crY + 2)
        .lineTo(CX + px, crY - 12)
        .lineTo(CX + px + 6, crY + 2)
        .fill(hat);
      g.moveTo(CX + px - 6, crY + 2)
        .lineTo(CX + px, crY - 12)
        .lineTo(CX + px + 6, crY + 2)
        .stroke({ color: c.outline, width: 1.5 });
    }
    // Jewels
    g.circle(CX - 10, crY + 10, 3).fill(0xe53935);
    g.circle(CX + 4, crY + 10, 3).fill(0x2196f3);
    g.circle(CX + 18, crY + 10, 3).fill(0x4caf50);
    // Highlight
    g.roundRect(CX - 16, crY + 3, 12, 4, 2)
      .fill({ color: hl, alpha: 0.4 });
  } else if (hatId.includes("wizard")) {
    const tipY = HEAD_CY - HEAD_R - 50;
    // Tall cone
    g.moveTo(CX - HEAD_R - 6, HEAD_CY - HEAD_R + 18)
      .lineTo(CX + 4, tipY)
      .lineTo(CX + HEAD_R + 6, HEAD_CY - HEAD_R + 18)
      .fill(c.outline);
    g.moveTo(CX - HEAD_R - 4, HEAD_CY - HEAD_R + 16)
      .lineTo(CX + 4, tipY + 3)
      .lineTo(CX + HEAD_R + 4, HEAD_CY - HEAD_R + 16)
      .fill(hat);
    // Star
    g.star(CX, HEAD_CY - HEAD_R - 16, 5, 8, 4, 0).fill(0xffd700);
    // Brim
    g.ellipse(CX, HEAD_CY - HEAD_R + 18, HEAD_R + 14, 8).fill(c.outline);
    g.ellipse(CX, HEAD_CY - HEAD_R + 18, HEAD_R + 12, 6).fill(shadow);
  } else if (hatId.includes("santa")) {
    const white = 0xf5f5f5;
    g.ellipse(CX, HEAD_CY - HEAD_R + 4, HEAD_R + 4, 18).fill(hat);
    // Droopy tip
    g.moveTo(CX + 10, HEAD_CY - HEAD_R - 8)
      .quadraticCurveTo(CX + 30, HEAD_CY - HEAD_R, CX + 28, HEAD_CY - HEAD_R + 16)
      .lineTo(CX + 10, HEAD_CY - HEAD_R + 4)
      .fill(hat);
    g.circle(CX + 28, HEAD_CY - HEAD_R + 16, 6).fill(white);
    // Fur trim
    g.roundRect(CX - HEAD_R - 6, HEAD_CY - HEAD_R + 14, HEAD_R * 2 + 12, 10, 5)
      .fill(white);
  } else if (hatId.includes("headphones")) {
    // Headband
    g.ellipse(CX, HEAD_CY - HEAD_R + 2, HEAD_R + 6, HEAD_R + 2)
      .stroke({ color: c.outline, width: 5 });
    g.ellipse(CX, HEAD_CY - HEAD_R + 2, HEAD_R + 4, HEAD_R)
      .stroke({ color: hat, width: 3 });
    // Left ear cup
    g.roundRect(CX - HEAD_R - 10, HEAD_CY - 8, 16, 20, 5).fill(c.outline);
    g.roundRect(CX - HEAD_R - 8, HEAD_CY - 6, 12, 16, 4).fill(hat);
    // Right ear cup
    g.roundRect(CX + HEAD_R - 4, HEAD_CY - 8, 16, 20, 5).fill(c.outline);
    g.roundRect(CX + HEAD_R - 2, HEAD_CY - 6, 12, 16, 4).fill(hat);
  } else if (hatId.includes("halo")) {
    const gold = 0xffd700;
    g.ellipse(CX, HEAD_CY - HEAD_R - 12, 26, 6)
      .stroke({ color: gold, width: 4, alpha: 0.9 });
    g.ellipse(CX, HEAD_CY - HEAD_R - 12, 26, 6)
      .fill({ color: 0xffecb3, alpha: 0.3 });
  } else if (hatId.includes("devil")) {
    // Left horn
    g.moveTo(CX - HEAD_R + 4, HEAD_CY - HEAD_R + 8)
      .quadraticCurveTo(CX - HEAD_R - 10, HEAD_CY - HEAD_R - 20, CX - HEAD_R + 14, HEAD_CY - HEAD_R - 14)
      .fill(hat);
    g.moveTo(CX - HEAD_R + 4, HEAD_CY - HEAD_R + 8)
      .quadraticCurveTo(CX - HEAD_R - 10, HEAD_CY - HEAD_R - 20, CX - HEAD_R + 14, HEAD_CY - HEAD_R - 14)
      .stroke({ color: c.outline, width: 2 });
    // Right horn
    g.moveTo(CX + HEAD_R - 4, HEAD_CY - HEAD_R + 8)
      .quadraticCurveTo(CX + HEAD_R + 10, HEAD_CY - HEAD_R - 20, CX + HEAD_R - 14, HEAD_CY - HEAD_R - 14)
      .fill(hat);
    g.moveTo(CX + HEAD_R - 4, HEAD_CY - HEAD_R + 8)
      .quadraticCurveTo(CX + HEAD_R + 10, HEAD_CY - HEAD_R - 20, CX + HEAD_R - 14, HEAD_CY - HEAD_R - 14)
      .stroke({ color: c.outline, width: 2 });
  } else if (hatId.includes("astronaut")) {
    const visor = 0x42a5f5;
    // Helmet dome
    g.circle(CX, HEAD_CY, HEAD_R + 12).fill(c.outline);
    g.circle(CX, HEAD_CY, HEAD_R + 10).fill(hat);
    // Visor
    g.ellipse(CX, HEAD_CY + 2, HEAD_R - 2, HEAD_R - 6).fill(c.outline);
    g.ellipse(CX, HEAD_CY + 2, HEAD_R - 4, HEAD_R - 8).fill(visor);
    // Visor glare
    g.ellipse(CX - 10, HEAD_CY - 6, 8, 6)
      .fill({ color: 0x90caf9, alpha: 0.5 });
  }

  parent.addChild(g);
}

// ─── ACCESSORIES (back) ───
function drawAccessoryBack(parent: Container, accId: string | null, c: Colors) {
  if (!accId) return;
  const g = new Graphics();

  if (accId.includes("cape")) {
    g.moveTo(CX - 22, BODY_Y + 6)
      .quadraticCurveTo(CX - 40, BODY_Y + 60, CX - 30, BODY_Y + 100)
      .lineTo(CX + 30, BODY_Y + 100)
      .quadraticCurveTo(CX + 40, BODY_Y + 60, CX + 22, BODY_Y + 6)
      .fill(c.accColor);
    g.moveTo(CX - 22, BODY_Y + 6)
      .quadraticCurveTo(CX - 40, BODY_Y + 60, CX - 30, BODY_Y + 100)
      .lineTo(CX + 30, BODY_Y + 100)
      .quadraticCurveTo(CX + 40, BODY_Y + 60, CX + 22, BODY_Y + 6)
      .stroke({ color: c.outline, width: 2 });
    // Inner fold shading
    g.ellipse(CX + 8, BODY_Y + 60, 16, 30)
      .fill({ color: darkenColor(c.accColor, 0.2), alpha: 0.3 });
  } else if (accId.includes("wings")) {
    const wc = c.accColor;
    // Left wing
    g.moveTo(CX - 24, BODY_Y + 10)
      .quadraticCurveTo(CX - 70, BODY_Y - 20, CX - 60, BODY_Y + 30)
      .quadraticCurveTo(CX - 65, BODY_Y + 50, CX - 28, BODY_Y + 40)
      .fill(wc);
    g.moveTo(CX - 24, BODY_Y + 10)
      .quadraticCurveTo(CX - 70, BODY_Y - 20, CX - 60, BODY_Y + 30)
      .quadraticCurveTo(CX - 65, BODY_Y + 50, CX - 28, BODY_Y + 40)
      .stroke({ color: c.outline, width: 1.5 });
    // Right wing
    g.moveTo(CX + 24, BODY_Y + 10)
      .quadraticCurveTo(CX + 70, BODY_Y - 20, CX + 60, BODY_Y + 30)
      .quadraticCurveTo(CX + 65, BODY_Y + 50, CX + 28, BODY_Y + 40)
      .fill(wc);
    g.moveTo(CX + 24, BODY_Y + 10)
      .quadraticCurveTo(CX + 70, BODY_Y - 20, CX + 60, BODY_Y + 30)
      .quadraticCurveTo(CX + 65, BODY_Y + 50, CX + 28, BODY_Y + 40)
      .stroke({ color: c.outline, width: 1.5 });
  } else if (accId.includes("backpack")) {
    g.roundRect(CX + 16, BODY_Y + 4, 24, 36, 6).fill(c.outline);
    g.roundRect(CX + 18, BODY_Y + 6, 20, 32, 4).fill(c.accColor);
    // Flap
    g.roundRect(CX + 18, BODY_Y + 6, 20, 12, 4).fill(darkenColor(c.accColor, 0.15));
    // Strap
    g.moveTo(CX + 20, BODY_Y + 4).lineTo(CX + 14, BODY_Y - 4)
      .stroke({ color: c.outline, width: 2.5 });
  } else if (accId.includes("shield")) {
    g.roundRect(CX - 46, BODY_Y + 10, 30, 38, 8).fill(c.outline);
    g.roundRect(CX - 44, BODY_Y + 12, 26, 34, 6).fill(c.accColor);
    // Emblem
    g.circle(CX - 31, BODY_Y + 29, 8).fill(lightenColor(c.accColor, 0.3));
    g.circle(CX - 31, BODY_Y + 29, 4).fill(c.accColor);
  }

  parent.addChild(g);
}

// ─── ACCESSORIES (front) ───
function drawAccessoryFront(parent: Container, accId: string | null, c: Colors) {
  if (!accId) return;
  const g = new Graphics();

  if (accId.includes("sword")) {
    const blade = 0xc0c0c0;
    // Blade
    g.roundRect(CX + 28, BODY_Y - 20, 5, 60, 2).fill(c.outline);
    g.roundRect(CX + 29, BODY_Y - 18, 3, 56, 1).fill(blade);
    // Guard
    g.roundRect(CX + 22, BODY_Y + 36, 18, 5, 2).fill(0x8d6e63);
    // Handle
    g.roundRect(CX + 28, BODY_Y + 38, 5, 14, 2).fill(0x5d4037);
    // Pommel
    g.circle(CX + 30, BODY_Y + 54, 4).fill(c.accColor);
    // Blade highlight
    g.roundRect(CX + 29.5, BODY_Y - 14, 1.5, 40, 0)
      .fill({ color: 0xffffff, alpha: 0.4 });
  } else if (accId.includes("pet_cat")) {
    const catC = c.accColor;
    const catX = CX + 40, catY = 234;
    // Body
    g.ellipse(catX, catY, 10, 8).fill(c.outline);
    g.ellipse(catX, catY, 8, 6).fill(catC);
    // Head
    g.circle(catX - 6, catY - 6, 7).fill(c.outline);
    g.circle(catX - 6, catY - 6, 5.5).fill(catC);
    // Ears
    g.moveTo(catX - 12, catY - 10).lineTo(catX - 10, catY - 18).lineTo(catX - 6, catY - 11).fill(catC);
    g.moveTo(catX - 2, catY - 10).lineTo(catX, catY - 18).lineTo(catX + 4, catY - 11).fill(catC);
    // Eyes
    g.circle(catX - 8, catY - 7, 1.5).fill(c.eye);
    g.circle(catX - 4, catY - 7, 1.5).fill(c.eye);
    // Tail
    g.moveTo(catX + 8, catY - 2)
      .quadraticCurveTo(catX + 20, catY - 14, catX + 16, catY - 8)
      .stroke({ color: catC, width: 3 });
  } else if (accId.includes("pet_dog")) {
    const dogC = c.accColor;
    const dogX = CX + 40, dogY = 236;
    // Body
    g.ellipse(dogX, dogY, 10, 7).fill(c.outline);
    g.ellipse(dogX, dogY, 8, 5.5).fill(dogC);
    // Head
    g.circle(dogX - 8, dogY - 5, 7).fill(c.outline);
    g.circle(dogX - 8, dogY - 5, 5.5).fill(dogC);
    // Floppy ears
    g.ellipse(dogX - 14, dogY - 2, 4, 8).fill(darkenColor(dogC, 0.2));
    g.ellipse(dogX - 2, dogY - 2, 4, 8).fill(darkenColor(dogC, 0.2));
    // Eyes
    g.circle(dogX - 10, dogY - 6, 1.5).fill(c.eye);
    g.circle(dogX - 6, dogY - 6, 1.5).fill(c.eye);
    // Nose
    g.circle(dogX - 8, dogY - 3, 2).fill(0x333333);
    // Tail
    g.moveTo(dogX + 8, dogY - 2)
      .quadraticCurveTo(dogX + 18, dogY - 16, dogX + 14, dogY - 10)
      .stroke({ color: dogC, width: 3 });
  }

  parent.addChild(g);
}

// ─── Helpers ───
function getShirtPattern(shirtId: string): string {
  if (shirtId.includes("striped")) return "stripes";
  if (shirtId.includes("hoodie")) return "hoodie";
  if (shirtId.includes("superhero")) return "hero";
  if (shirtId.includes("tuxedo")) return "tuxedo";
  if (shirtId.includes("dragon")) return "dragon";
  if (shirtId.includes("galaxy")) return "galaxy";
  return "plain";
}

function getPantsStyle(pantsId: string): string {
  if (pantsId.includes("shorts")) return "shorts";
  if (pantsId.includes("skirt")) return "skirt";
  return "full";
}

function getShoeStyle(shoesId: string): string {
  if (shoesId.includes("boots") && !shoesId.includes("rocket")) return "boots";
  if (shoesId.includes("heels")) return "heels";
  if (shoesId.includes("rocket")) return "rocket";
  if (shoesId.includes("cloud")) return "cloud";
  return "sneakers";
}
