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
