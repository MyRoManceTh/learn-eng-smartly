import { Container, Graphics, Ticker } from "pixi.js";
import { blendColor } from "./colorUtils";

// ============================================================
// 1. IDLE ANIMATION - Claw-Empire style sine-wave bounce
// ============================================================

export function setupIdleAnimation(
  characterContainer: Container,
  ticker: Ticker
): () => void {
  let time = 0;
  const baseY = characterContainer.y;

  const update = (dt: Ticker) => {
    time += dt.deltaTime * 0.04;
    // Gentle bounce: 2px amplitude
    characterContainer.y = baseY + Math.sin(time) * 2;
  };

  ticker.add(update);
  return () => {
    ticker.remove(update);
    characterContainer.y = baseY;
  };
}

// ============================================================
// 2. EVOLUTION EFFECTS - Particles/glow per stage (1-5)
// ============================================================

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: number;
}

/** Evolution stage colors matching evolutionStages.ts */
const STAGE_COLORS: Record<number, number> = {
  2: 0x4caf50, // green
  3: 0x2196f3, // blue
  4: 0x9c27b0, // purple
  5: 0xffd700, // gold
};

export function setupEvolutionEffects(
  parentContainer: Container,
  ticker: Ticker,
  stage: number,
  canvasSize: number
): () => void {
  if (stage <= 1) return () => {};

  const particles: Particle[] = [];
  const graphics = new Graphics();
  // Insert behind character (at index 0)
  parentContainer.addChildAt(graphics, 0);

  const color = STAGE_COLORS[stage] || 0xffffff;
  let time = 0;
  const cx = canvasSize / 2;
  const cy = canvasSize / 2;

  const update = (dt: Ticker) => {
    time += dt.deltaTime;
    graphics.clear();

    // --- Stage 2+: Soft glow circle ---
    if (stage >= 2) {
      const glowAlpha = 0.12 + Math.sin(time * 0.025) * 0.04;
      const glowRadius = canvasSize * 0.28 + Math.sin(time * 0.02) * 4;
      graphics.circle(cx, cy, glowRadius).fill({ color, alpha: glowAlpha });
    }

    // --- Stage 3+: Sparkle particles ---
    if (stage >= 3 && Math.random() < 0.08) {
      particles.push({
        x: cx + (Math.random() - 0.5) * canvasSize * 0.6,
        y: cy + (Math.random() - 0.5) * canvasSize * 0.7,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.15 - Math.random() * 0.25,
        life: 0,
        maxLife: 50 + Math.random() * 30,
        size: 1 + Math.random() * 1.5,
        color,
      });
    }

    // --- Stage 4+: Aura ring pulse ---
    if (stage >= 4) {
      const auraAlpha = 0.08 + Math.sin(time * 0.03) * 0.04;
      const auraRadius = canvasSize * 0.35 + Math.sin(time * 0.025) * 5;
      graphics
        .circle(cx, cy, auraRadius)
        .stroke({ color, alpha: auraAlpha, width: 2 });
    }

    // --- Stage 5: Rising golden particles ---
    if (stage >= 5 && Math.random() < 0.12) {
      particles.push({
        x: cx + (Math.random() - 0.5) * canvasSize * 0.4,
        y: canvasSize * 0.85,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.4 - Math.random() * 0.4,
        life: 0,
        maxLife: 70 + Math.random() * 30,
        size: 1.2 + Math.random() * 1.3,
        color: 0xffd700,
      });
    }

    // --- Update & draw all particles ---
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      const lifeRatio = p.life / p.maxLife;
      if (lifeRatio >= 1) {
        particles.splice(i, 1);
        continue;
      }

      // Fade in quickly, fade out slowly
      const alpha =
        lifeRatio < 0.15
          ? lifeRatio / 0.15
          : 1 - (lifeRatio - 0.15) / 0.85;
      const size = p.size * (1 - lifeRatio * 0.4);

      // Star shape for sparkles (stage 3+)
      if (stage >= 3) {
        graphics.star(p.x, p.y, 4, size, size * 0.4, 0).fill({ color: p.color, alpha });
      } else {
        graphics.circle(p.x, p.y, size).fill({ color: p.color, alpha });
      }
    }
  };

  ticker.add(update);

  return () => {
    ticker.remove(update);
    parentContainer.removeChild(graphics);
    graphics.destroy();
  };
}

// ============================================================
// 3. RAINBOW HAIR SHIMMER - Animated hue-shift overlay
// ============================================================

export function setupRainbowShimmer(
  container: Container,
  ticker: Ticker,
  canvasSize: number,
  pixelSize: number
): () => void {
  const graphics = new Graphics();
  container.addChild(graphics);
  let time = 0;

  // Rainbow colors cycle
  const rainbowColors = [0xff0000, 0xff8000, 0xffff00, 0x00ff00, 0x0080ff, 0x8000ff];

  const update = (dt: Ticker) => {
    time += dt.deltaTime * 0.02;
    graphics.clear();

    // Overlay a shifting color on the hair region (rows 1-7)
    const hairRowStart = 1 * pixelSize;
    const hairRowEnd = 7 * pixelSize;
    const width = canvasSize;

    const colorIndex = Math.floor(time * 3) % rainbowColors.length;
    const nextIndex = (colorIndex + 1) % rainbowColors.length;
    const blend = (time * 3) % 1;
    const currentColor = blendColor(
      rainbowColors[colorIndex],
      rainbowColors[nextIndex],
      blend
    );

    graphics
      .rect(0, hairRowStart, width, hairRowEnd - hairRowStart)
      .fill({ color: currentColor, alpha: 0.25 });
  };

  ticker.add(update);

  return () => {
    ticker.remove(update);
    container.removeChild(graphics);
    graphics.destroy();
  };
}

// ============================================================
// 4. EQUIP TRANSITION - Flash + scale on change
// ============================================================

export function playEquipTransition(
  container: Container,
  ticker: Ticker
): void {
  let frame = 0;
  const duration = 12; // ~0.2s at 60fps

  const update = (dt: Ticker) => {
    frame += dt.deltaTime;
    const progress = Math.min(1, frame / duration);

    // Quick scale pulse
    const scale = 1 + Math.sin(progress * Math.PI) * 0.06;
    container.scale.set(scale);

    // Brief brightness flash
    container.alpha = progress < 0.25 ? 0.75 + progress : 1;

    if (progress >= 1) {
      container.scale.set(1);
      container.alpha = 1;
      ticker.remove(update);
    }
  };

  ticker.add(update);
}
