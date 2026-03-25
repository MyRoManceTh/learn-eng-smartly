/**
 * LINE Sticker Animations
 *
 * Smooth, expressive animations for the LINE sticker-style character:
 * idle bounce, blink, squash-stretch, emotions, walk, celebration, wave/dance.
 */
import { Container, Graphics, Ticker } from "pixi.js";
import { EquippedItems } from "@/types/avatar";
import type { CharacterPose } from "@/types/classroom";
import {
  drawLineStickerCharacter,
  StickerEmotion,
  GRID_H,
} from "./drawLineStickerCharacter";

// ─── Easing helpers ───
const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const easeOutBounce = (t: number) => {
  if (t < 1 / 2.75) return 7.5625 * t * t;
  if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
  if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
  return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
};

// ════════════════════════════════════════════
// 1. IDLE — Gentle bounce with subtle squash-stretch
// ════════════════════════════════════════════

export function setupStickerIdle(
  characterContainer: Container,
  ticker: Ticker,
): () => void {
  let time = 0;
  const baseY = characterContainer.y;
  const baseScaleX = characterContainer.scale.x;
  const baseScaleY = characterContainer.scale.y;

  const update = (dt: Ticker) => {
    time += dt.deltaTime * 0.035;

    // Gentle sine bounce — 1.5px amplitude
    const bounce = Math.sin(time) * 1.5;
    characterContainer.y = baseY + bounce;

    // Subtle squash-stretch synced with bounce
    const squash = Math.sin(time) * 0.015;
    const signX = baseScaleX < 0 ? -1 : 1;
    characterContainer.scale.x = (Math.abs(baseScaleX) + squash) * signX;
    characterContainer.scale.y = baseScaleY - squash;
  };

  ticker.add(update);
  return () => {
    ticker.remove(update);
    characterContainer.y = baseY;
    characterContainer.scale.x = baseScaleX;
    characterContainer.scale.y = baseScaleY;
  };
}

// ════════════════════════════════════════════
// 2. BLINK — Natural eye blink every 3-6 seconds
// ════════════════════════════════════════════

export function setupStickerBlink(
  characterContainer: Container,
  ticker: Ticker,
  equipped: EquippedItems,
  emotion: StickerEmotion,
  pose: CharacterPose = "idle",
): () => void {
  let elapsed = 0;
  let blinkFrame = 0; // 0=open, 1=half, 2=closed
  let nextBlinkAt = 180 + Math.random() * 180; // 3-6 sec at 60fps
  let blinkPhase = -1; // -1 = waiting, 0..5 = in blink
  const BLINK_DURATION = 8; // frames for full blink cycle (~0.13s)

  const update = (dt: Ticker) => {
    elapsed += dt.deltaTime;

    if (blinkPhase === -1) {
      // Waiting for next blink
      if (elapsed >= nextBlinkAt) {
        blinkPhase = 0;
        elapsed = 0;
      }
      return;
    }

    // In blink animation
    blinkPhase += dt.deltaTime;
    const progress = blinkPhase / BLINK_DURATION;

    let newFrame: number;
    if (progress < 0.2) newFrame = 1; // closing
    else if (progress < 0.5) newFrame = 2; // closed
    else if (progress < 0.7) newFrame = 1; // opening
    else newFrame = 0; // open

    if (newFrame !== blinkFrame) {
      blinkFrame = newFrame;
      drawLineStickerCharacter(characterContainer, equipped, GRID_H, emotion, 0, blinkFrame, pose);
    }

    if (progress >= 1) {
      blinkPhase = -1;
      elapsed = 0;
      blinkFrame = 0;
      nextBlinkAt = 180 + Math.random() * 180;
      // Sometimes double-blink
      if (Math.random() < 0.2) nextBlinkAt = 15;
    }
  };

  ticker.add(update);
  return () => {
    ticker.remove(update);
    if (blinkFrame !== 0) {
      drawLineStickerCharacter(characterContainer, equipped, GRID_H, emotion, 0, 0, pose);
    }
  };
}

// ════════════════════════════════════════════
// 3. EMOTION REACTION — One-shot animation when emotion changes
// ════════════════════════════════════════════

export function playStickerEmotionReaction(
  characterContainer: Container,
  ticker: Ticker,
  emotion: StickerEmotion,
): void {
  let frame = 0;
  const duration = 20; // ~0.33s at 60fps
  const baseY = characterContainer.y;
  const baseScaleX = characterContainer.scale.x;
  const baseScaleY = characterContainer.scale.y;

  const update = (dt: Ticker) => {
    frame += dt.deltaTime;
    const progress = Math.min(1, frame / duration);
    const ease = easeOutBounce(progress);

    switch (emotion) {
      case "happy":
        // Happy jump
        characterContainer.y = baseY - Math.sin(progress * Math.PI) * 4;
        break;
      case "surprised":
        // Jump back with scale pulse
        characterContainer.y = baseY - Math.sin(progress * Math.PI) * 3;
        {
          const signX = baseScaleX < 0 ? -1 : 1;
          const pulse = 1 + Math.sin(progress * Math.PI) * 0.08;
          characterContainer.scale.x = Math.abs(baseScaleX) * pulse * signX;
          characterContainer.scale.y = baseScaleY * pulse;
        }
        break;
      case "sad":
        // Slight droop
        characterContainer.y = baseY + ease * 1.5 * (1 - progress);
        break;
      case "angry":
        // Shake
        characterContainer.x += Math.sin(frame * 1.5) * 0.5 * (1 - progress);
        break;
      case "love":
        // Wiggle
        characterContainer.rotation = Math.sin(frame * 0.8) * 0.06 * (1 - progress);
        break;
    }

    if (progress >= 1) {
      characterContainer.y = baseY;
      characterContainer.scale.x = baseScaleX;
      characterContainer.scale.y = baseScaleY;
      characterContainer.rotation = 0;
      ticker.remove(update);
    }
  };

  ticker.add(update);
}

// ════════════════════════════════════════════
// 4. WALK CYCLE — Leg alternation with bounce
// ════════════════════════════════════════════

const WALK_SEQUENCE = [1, 0, 2, 0]; // left-stand-right-stand

export function setupStickerWalkCycle(
  characterContainer: Container,
  ticker: Ticker,
  equipped: EquippedItems,
  emotion: StickerEmotion,
  pose: CharacterPose = "idle",
): () => void {
  let elapsed = 0;
  let totalTime = 0;
  const FRAME_DURATION = 5; // ~83ms at 60fps → 12 FPS walk cycle
  let seqIndex = 0;
  let currentFrame = 0;
  const baseY = characterContainer.y;
  const baseScaleX = characterContainer.scale.x;
  const baseScaleY = characterContainer.scale.y;

  const update = (dt: Ticker) => {
    elapsed += dt.deltaTime;
    totalTime += dt.deltaTime;

    // Wobble Y — gentle sine bounce like game characters
    const wobble = Math.sin(totalTime * 0.3) * 1.2;
    characterContainer.y = baseY + wobble;

    // Squash-stretch synced with steps
    const squash = Math.sin(totalTime * 0.3) * 0.02;
    const signX = baseScaleX < 0 ? -1 : 1;
    characterContainer.scale.x = (Math.abs(baseScaleX) + squash) * signX;
    characterContainer.scale.y = baseScaleY - squash;

    if (elapsed >= FRAME_DURATION) {
      elapsed = 0;
      seqIndex = (seqIndex + 1) % WALK_SEQUENCE.length;
      const newFrame = WALK_SEQUENCE[seqIndex];

      if (newFrame !== currentFrame) {
        currentFrame = newFrame;
        drawLineStickerCharacter(characterContainer, equipped, GRID_H, emotion, currentFrame, 0, pose);
      }
    }
  };

  ticker.add(update);

  return () => {
    ticker.remove(update);
    characterContainer.y = baseY;
    characterContainer.scale.x = baseScaleX;
    characterContainer.scale.y = baseScaleY;
    drawLineStickerCharacter(characterContainer, equipped, GRID_H, emotion, 0, 0, pose);
  };
}

// ════════════════════════════════════════════
// 5. CELEBRATION — Spin + confetti particles
// ════════════════════════════════════════════

export function playStickerCelebration(
  parentContainer: Container,
  characterContainer: Container,
  ticker: Ticker,
): () => void {
  let frame = 0;
  const duration = 60; // 1 second
  const baseY = characterContainer.y;

  interface ConfettiParticle {
    x: number; y: number;
    vx: number; vy: number;
    color: number; size: number;
    life: number;
  }

  const particles: ConfettiParticle[] = [];
  const confettiGfx = new Graphics();
  parentContainer.addChild(confettiGfx);

  const COLORS = [0xff6b6b, 0xffd93d, 0x6bcbff, 0xff9ff3, 0x48dbfb, 0xfeca57];

  const update = (dt: Ticker) => {
    frame += dt.deltaTime;
    const progress = Math.min(1, frame / duration);

    // Character jump + spin
    characterContainer.y = baseY - Math.sin(progress * Math.PI) * 6;
    characterContainer.rotation = Math.sin(progress * Math.PI * 4) * 0.1 * (1 - progress);

    // Spawn confetti in first half
    if (progress < 0.5 && Math.random() < 0.4) {
      particles.push({
        x: 16 + (Math.random() - 0.5) * 20,
        y: 8 + Math.random() * 10,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.3 - Math.random() * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 0.8 + Math.random() * 1,
        life: 0,
      });
    }

    // Draw confetti
    confettiGfx.clear();
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.015; // gravity
      p.life++;

      if (p.life > 60) {
        particles.splice(i, 1);
        continue;
      }

      const alpha = Math.max(0, 1 - p.life / 60);
      confettiGfx.rect(p.x, p.y, p.size, p.size).fill({ color: p.color, alpha });
    }

    if (progress >= 1 && particles.length === 0) {
      characterContainer.y = baseY;
      characterContainer.rotation = 0;
      parentContainer.removeChild(confettiGfx);
      confettiGfx.destroy();
      ticker.remove(update);
    }
  };

  ticker.add(update);

  return () => {
    ticker.remove(update);
    characterContainer.y = baseY;
    characterContainer.rotation = 0;
    if (confettiGfx.parent) {
      parentContainer.removeChild(confettiGfx);
      confettiGfx.destroy();
    }
  };
}

// ════════════════════════════════════════════
// 6. WAVE — Hand wave gesture
// ════════════════════════════════════════════

export function playStickerWave(
  characterContainer: Container,
  ticker: Ticker,
): void {
  let frame = 0;
  const duration = 40; // ~0.67s

  const update = (dt: Ticker) => {
    frame += dt.deltaTime;
    const progress = Math.min(1, frame / duration);

    // Gentle tilt back and forth
    characterContainer.rotation = Math.sin(progress * Math.PI * 3) * 0.08 * (1 - progress);

    if (progress >= 1) {
      characterContainer.rotation = 0;
      ticker.remove(update);
    }
  };

  ticker.add(update);
}

// ════════════════════════════════════════════
// 7. DANCE — Fun dance loop
// ════════════════════════════════════════════

export function setupStickerDance(
  characterContainer: Container,
  ticker: Ticker,
): () => void {
  let time = 0;
  const baseY = characterContainer.y;
  const baseScaleX = characterContainer.scale.x;

  const update = (dt: Ticker) => {
    time += dt.deltaTime * 0.08;

    // Bounce
    characterContainer.y = baseY + Math.abs(Math.sin(time * 2)) * -2.5;
    // Side-to-side sway
    characterContainer.rotation = Math.sin(time) * 0.12;
    // Squish on beat
    const signX = baseScaleX < 0 ? -1 : 1;
    const squish = Math.abs(Math.sin(time * 2)) * 0.04;
    characterContainer.scale.x = (Math.abs(baseScaleX) + squish) * signX;
    characterContainer.scale.y = 1 - squish;
  };

  ticker.add(update);

  return () => {
    ticker.remove(update);
    characterContainer.y = baseY;
    characterContainer.rotation = 0;
    characterContainer.scale.x = baseScaleX;
    characterContainer.scale.y = 1;
  };
}

// ════════════════════════════════════════════
// 8. FLOATING HEARTS — For love emotion
// ════════════════════════════════════════════

export function setupFloatingHearts(
  parentContainer: Container,
  ticker: Ticker,
  canvasSize: number,
): () => void {
  interface HeartParticle {
    x: number; y: number;
    vx: number; vy: number;
    size: number; life: number; maxLife: number;
  }

  const hearts: HeartParticle[] = [];
  const gfx = new Graphics();
  parentContainer.addChild(gfx);
  const cx = canvasSize / 2;

  const update = (dt: Ticker) => {
    // Spawn hearts
    if (Math.random() < 0.06) {
      hearts.push({
        x: cx + (Math.random() - 0.5) * 16,
        y: 10 + Math.random() * 5,
        vx: (Math.random() - 0.5) * 0.1,
        vy: -0.12 - Math.random() * 0.08,
        size: 1 + Math.random() * 1.5,
        life: 0,
        maxLife: 50 + Math.random() * 30,
      });
    }

    gfx.clear();
    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.x += h.vx + Math.sin(h.life * 0.1) * 0.05;
      h.y += h.vy;
      h.life++;

      if (h.life >= h.maxLife) {
        hearts.splice(i, 1);
        continue;
      }

      const alpha = h.life < 10 ? h.life / 10 : 1 - (h.life - 10) / (h.maxLife - 10);
      drawMiniHeart(gfx, h.x, h.y, h.size, alpha);
    }
  };

  ticker.add(update);

  return () => {
    ticker.remove(update);
    if (gfx.parent) {
      parentContainer.removeChild(gfx);
      gfx.destroy();
    }
  };
}

function drawMiniHeart(g: Graphics, cx: number, cy: number, size: number, alpha: number) {
  const s = size * 0.5;
  g.moveTo(cx, cy + s * 0.6)
    .bezierCurveTo(cx - s * 1.3, cy - s * 0.4, cx - s * 0.5, cy - s * 1.4, cx, cy - s * 0.5)
    .bezierCurveTo(cx + s * 0.5, cy - s * 1.4, cx + s * 1.3, cy - s * 0.4, cx, cy + s * 0.6)
    .fill({ color: 0xff4081, alpha });
}

// ════════════════════════════════════════════
// 9. EQUIP TRANSITION — Flash + scale pulse
// ════════════════════════════════════════════

export function playStickerEquipTransition(
  container: Container,
  ticker: Ticker,
): void {
  let frame = 0;
  const duration = 15;
  const baseScaleX = container.scale.x;

  const update = (dt: Ticker) => {
    frame += dt.deltaTime;
    const progress = Math.min(1, frame / duration);

    // Scale pulse
    const pulse = 1 + Math.sin(progress * Math.PI) * 0.06;
    const signX = baseScaleX < 0 ? -1 : 1;
    container.scale.set(Math.abs(baseScaleX) * pulse * signX, pulse);

    // Flash
    container.alpha = progress < 0.2 ? 0.7 + progress * 1.5 : 1;

    if (progress >= 1) {
      container.scale.x = baseScaleX;
      container.scale.y = 1;
      container.alpha = 1;
      ticker.remove(update);
    }
  };

  ticker.add(update);
}

// ════════════════════════════════════════════
// 10. AURA ANIMATIONS — Persistent particle effects per aura type
// ════════════════════════════════════════════

interface AuraParticle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; life: number; maxLife: number;
  color: number; alpha: number;
}

export function setupAuraAnimation(
  parentContainer: Container,
  ticker: Ticker,
  auraId: string,
  canvasH: number,
): () => void {
  const particles: AuraParticle[] = [];
  const gfx = new Graphics();
  parentContainer.addChildAt(gfx, 0); // behind character
  const cx = canvasH * 0.8; // ~32 for 64w canvas
  let time = 0;

  const CX = 32; // character center x
  const BODY_TOP = 41;

  const update = (dt: Ticker) => {
    time += dt.deltaTime * 0.05;
    gfx.clear();

    if (auraId.includes("fire")) {
      updateFireAura(gfx, particles, time, CX, BODY_TOP, dt.deltaTime);
    } else if (auraId.includes("ice")) {
      updateIceAura(gfx, particles, time, CX, BODY_TOP, dt.deltaTime);
    } else if (auraId.includes("lightning")) {
      updateLightningAura(gfx, particles, time, CX, BODY_TOP, dt.deltaTime);
    } else if (auraId.includes("dark")) {
      updateDarkAura(gfx, particles, time, CX, BODY_TOP, dt.deltaTime);
    } else if (auraId.includes("supersaiyan")) {
      updateSuperSaiyanAura(gfx, particles, time, CX, BODY_TOP, dt.deltaTime);
    }
  };

  ticker.add(update);

  return () => {
    ticker.remove(update);
    if (gfx.parent) {
      parentContainer.removeChild(gfx);
      gfx.destroy();
    }
  };
}

// ── Fire Aura: rising flame particles ──
function updateFireAura(
  g: Graphics, particles: AuraParticle[],
  time: number, cx: number, bodyTop: number, delta: number,
) {
  // Pulsing glow — more visible
  const glowAlpha = 0.25 + Math.sin(time * 3) * 0.1;
  g.ellipse(cx, bodyTop + 4, 24 + Math.sin(time * 2) * 4, 30 + Math.sin(time * 2.5) * 3)
    .fill({ color: 0xff6d00, alpha: glowAlpha });
  g.ellipse(cx, bodyTop + 4, 18 + Math.sin(time * 2) * 2, 24 + Math.sin(time * 2.5) * 2)
    .fill({ color: 0xffeb3b, alpha: glowAlpha * 0.6 });

  // Spawn flame particles
  if (Math.random() < 0.3) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 10 + Math.random() * 12;
    particles.push({
      x: cx + Math.cos(angle) * dist,
      y: bodyTop + 15 + Math.random() * 10,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -0.3 - Math.random() * 0.25,
      size: 1.2 + Math.random() * 1.8,
      life: 0, maxLife: 30 + Math.random() * 20,
      color: Math.random() < 0.5 ? 0xff6d00 : 0xffab00,
      alpha: 0.8,
    });
  }

  // Update & draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx + Math.sin(p.life * 0.15) * 0.1;
    p.y += p.vy;
    p.size *= 0.97;
    p.life++;

    if (p.life >= p.maxLife || p.size < 0.3) {
      particles.splice(i, 1);
      continue;
    }

    const a = p.alpha * (1 - p.life / p.maxLife);
    g.circle(p.x, p.y, p.size).fill({ color: p.color, alpha: a });
    // Inner bright core
    g.circle(p.x, p.y, p.size * 0.4).fill({ color: 0xffeb3b, alpha: a * 0.7 });
  }
}

// ── Ice Aura: snowflake / crystal particles ──
function updateIceAura(
  g: Graphics, particles: AuraParticle[],
  time: number, cx: number, bodyTop: number, delta: number,
) {
  // Rotating crystalline glow — more visible
  const glowAlpha = 0.2 + Math.sin(time * 2) * 0.08;
  g.ellipse(cx, bodyTop + 4, 24 + Math.sin(time * 1.5) * 3, 30)
    .fill({ color: 0xb3e5fc, alpha: glowAlpha });
  g.ellipse(cx, bodyTop + 4, 18, 24)
    .fill({ color: 0xe3f2fd, alpha: glowAlpha * 0.7 });

  // Spawn ice crystals
  if (Math.random() < 0.1) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 14 + Math.random() * 10;
    particles.push({
      x: cx + Math.cos(angle) * dist,
      y: bodyTop - 5 + Math.random() * 30,
      vx: Math.cos(angle) * 0.05,
      vy: -0.05 + Math.random() * 0.1,
      size: 0.8 + Math.random() * 1.5,
      life: 0, maxLife: 50 + Math.random() * 30,
      color: Math.random() < 0.4 ? 0xe3f2fd : 0xb3e5fc,
      alpha: 0.7,
    });
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    // Gentle orbit
    p.x += p.vx + Math.sin(time * 3 + i) * 0.08;
    p.y += p.vy + Math.cos(time * 2 + i * 0.5) * 0.05;
    p.life++;

    if (p.life >= p.maxLife) {
      particles.splice(i, 1);
      continue;
    }

    const fade = p.life < 10 ? p.life / 10 : 1 - (p.life - 10) / (p.maxLife - 10);
    const a = p.alpha * Math.max(0, fade);
    // Diamond shape
    g.poly([p.x, p.y - p.size, p.x + p.size * 0.6, p.y, p.x, p.y + p.size, p.x - p.size * 0.6, p.y])
      .fill({ color: p.color, alpha: a });
    // Sparkle highlight
    g.circle(p.x, p.y - p.size * 0.3, p.size * 0.2)
      .fill({ color: 0xffffff, alpha: a * 0.8 });
  }
}

// ── Lightning Aura: electric sparks + bolts ──
function updateLightningAura(
  g: Graphics, particles: AuraParticle[],
  time: number, cx: number, bodyTop: number, delta: number,
) {
  // Electric pulse glow — more visible
  const pulse = Math.random() < 0.1 ? 0.35 : 0.18 + Math.sin(time * 5) * 0.08;
  g.ellipse(cx, bodyTop + 4, 26, 30).fill({ color: 0xffd600, alpha: pulse });
  g.ellipse(cx, bodyTop + 4, 20, 24).fill({ color: 0xffffff, alpha: pulse * 0.3 });

  // Random lightning bolts (flicker effect)
  if (Math.random() < 0.08) {
    const angle = Math.random() * Math.PI * 2;
    const startX = cx + Math.cos(angle) * 16;
    const startY = bodyTop - 6 + Math.sin(angle) * 18;
    let bx = startX, by = startY;

    for (let seg = 0; seg < 3; seg++) {
      const nx = bx + (Math.random() - 0.5) * 6;
      const ny = by + 3 + Math.random() * 3;
      g.moveTo(bx, by).lineTo(nx, ny).stroke({ color: 0xffd600, width: 1.5 });
      g.moveTo(bx, by).lineTo(nx, ny).stroke({ color: 0xffffff, width: 0.5 });
      bx = nx; by = ny;
    }
  }

  // Electric sparks
  if (Math.random() < 0.12) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 10 + Math.random() * 14;
    particles.push({
      x: cx + Math.cos(angle) * dist,
      y: bodyTop + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 0.6 + Math.random() * 1,
      life: 0, maxLife: 8 + Math.random() * 8,
      color: Math.random() < 0.5 ? 0xffd600 : 0xffffff,
      alpha: 0.9,
    });
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life++;
    if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }
    const a = p.alpha * (1 - p.life / p.maxLife);
    g.circle(p.x, p.y, p.size).fill({ color: p.color, alpha: a });
  }
}

// ── Dark Aura: swirling shadow wisps ──
function updateDarkAura(
  g: Graphics, particles: AuraParticle[],
  time: number, cx: number, bodyTop: number, delta: number,
) {
  // Pulsing dark shroud — more visible
  const glowAlpha = 0.25 + Math.sin(time * 1.5) * 0.08;
  g.ellipse(cx, bodyTop + 4, 28 + Math.sin(time) * 4, 34 + Math.cos(time * 0.7) * 3)
    .fill({ color: 0x1a0033, alpha: glowAlpha });
  g.ellipse(cx, bodyTop + 4, 22, 28)
    .fill({ color: 0x7b1fa2, alpha: glowAlpha * 0.5 });

  // Spawn shadow wisps
  if (Math.random() < 0.1) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 8 + Math.random() * 16;
    particles.push({
      x: cx + Math.cos(angle) * dist,
      y: bodyTop + 10 + Math.random() * 15,
      vx: Math.cos(angle + Math.PI / 2) * 0.08,
      vy: -0.1 - Math.random() * 0.1,
      size: 1.5 + Math.random() * 2,
      life: 0, maxLife: 40 + Math.random() * 30,
      color: Math.random() < 0.3 ? 0x7b1fa2 : 0x4a148c,
      alpha: 0.5,
    });
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    // Spiral orbit
    const orbitSpeed = 0.03;
    const dx = p.x - cx, dy = p.y - (bodyTop + 10);
    p.x += -dy * orbitSpeed + p.vx;
    p.y += dx * orbitSpeed + p.vy;
    p.size *= 0.995;
    p.life++;

    if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }
    const fade = p.life < 8 ? p.life / 8 : 1 - (p.life - 8) / (p.maxLife - 8);
    const a = p.alpha * Math.max(0, fade);
    g.circle(p.x, p.y, p.size).fill({ color: p.color, alpha: a });
  }
}

// ── Super Saiyan Aura: intense golden energy ──
function updateSuperSaiyanAura(
  g: Graphics, particles: AuraParticle[],
  time: number, cx: number, bodyTop: number, delta: number,
) {
  // Multi-layer pulsing glow — more visible
  const p1 = 0.3 + Math.sin(time * 4) * 0.1;
  const p2 = 0.2 + Math.sin(time * 3 + 1) * 0.08;
  g.ellipse(cx, bodyTop + 2, 30 + Math.sin(time * 2) * 5, 36 + Math.sin(time * 2.5) * 4)
    .fill({ color: 0xffd600, alpha: p1 });
  g.ellipse(cx, bodyTop + 2, 24 + Math.sin(time * 3) * 3, 30 + Math.sin(time * 3) * 3)
    .fill({ color: 0xfff9c4, alpha: p2 });
  g.ellipse(cx, bodyTop + 2, 16, 22)
    .fill({ color: 0xffffff, alpha: p2 * 0.4 });

  // Rising energy particles
  if (Math.random() < 0.2) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 6 + Math.random() * 18;
    particles.push({
      x: cx + Math.cos(angle) * dist,
      y: bodyTop + 20 + Math.random() * 10,
      vx: (Math.random() - 0.5) * 0.1,
      vy: -0.4 - Math.random() * 0.3,
      size: 0.8 + Math.random() * 1.5,
      life: 0, maxLife: 25 + Math.random() * 15,
      color: Math.random() < 0.6 ? 0xffd600 : 0xffffff,
      alpha: 0.9,
    });
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx + Math.sin(p.life * 0.2) * 0.08;
    p.y += p.vy;
    p.size *= 0.96;
    p.life++;

    if (p.life >= p.maxLife || p.size < 0.2) {
      particles.splice(i, 1); continue;
    }

    const a = p.alpha * (1 - p.life / p.maxLife);
    g.circle(p.x, p.y, p.size).fill({ color: p.color, alpha: a });
    // Bright core
    if (p.color === 0xffffff) {
      g.circle(p.x, p.y, p.size * 0.5).fill({ color: 0xffffff, alpha: a * 0.8 });
    }
  }

  // Occasional energy burst rings
  if (Math.random() < 0.02) {
    const ringR = 12 + Math.random() * 8;
    g.ellipse(cx, bodyTop + 4, ringR, ringR * 0.6)
      .stroke({ color: 0xffd600, width: 1, alpha: 0.3 });
  }
}
