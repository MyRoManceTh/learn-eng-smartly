/**
 * Aura Visual Effects — Dramatic energy effects matching DBZ / RPG style
 *
 * Supports two scale modes:
 *   "sprite" = 32×40 canvas (SpriteAvatar on MyPage)
 *   "sticker" = 64×80 canvas (PixelAvatar / drawLineStickerCharacter)
 *
 * Fire / Super Saiyan: Spiky flame tongues radiating outward + inner white glow
 * Ice: Swirling blue arc streaks orbiting + crystalline sparkles
 * Lightning: Electric bolts + flickering plasma field
 * Dark: Swirling purple/black wisps with spiral motion
 */

import { Graphics } from "pixi.js";

// ── Particle type ──
export interface AuraParticle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; life: number; maxLife: number;
  color: number; alpha: number;
  angle?: number; // for arc streaks
}

// ── Scale presets ──
export interface AuraScale {
  cx: number;      // character center x
  bodyCenter: number; // body center y
  bodyH: number;   // body height (for spike length)
  bodyW: number;   // body width (for spike spread)
}

export const SPRITE_SCALE: AuraScale = { cx: 16, bodyCenter: 22, bodyH: 22, bodyW: 14 };
export const STICKER_SCALE: AuraScale = { cx: 32, bodyCenter: 45, bodyH: 40, bodyW: 26 };

// ════════════════════════════════════════════
// Helper: Draw a single flame spike (triangle)
// ════════════════════════════════════════════
function drawSpike(
  g: Graphics, cx: number, cy: number,
  angle: number, length: number, width: number,
  color: number, alpha: number,
) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const tipX = cx + cos * length;
  const tipY = cy + sin * length;
  // Perpendicular for base width
  const perpX = -sin * width;
  const perpY = cos * width;
  g.poly([
    cx + perpX, cy + perpY,
    tipX, tipY,
    cx - perpX, cy - perpY,
  ]).fill({ color, alpha });
}

// ════════════════════════════════════════════
// Helper: Draw a curved arc stroke
// ════════════════════════════════════════════
function drawArc(
  g: Graphics, cx: number, cy: number,
  radius: number, startAngle: number, sweep: number,
  color: number, width: number, alpha: number,
) {
  const steps = 8;
  const step = sweep / steps;
  let first = true;
  for (let i = 0; i <= steps; i++) {
    const a = startAngle + step * i;
    const x = cx + Math.cos(a) * radius;
    const y = cy + Math.sin(a) * radius;
    if (first) { g.moveTo(x, y); first = false; }
    else g.lineTo(x, y);
  }
  g.stroke({ color, width, alpha });
}

// ════════════════════════════════════════════
// FIRE AURA — Spiky flame tongues
// ════════════════════════════════════════════
export function renderFireAura(
  g: Graphics, ps: AuraParticle[], t: number, s: AuraScale,
) {
  const { cx, bodyCenter, bodyH, bodyW } = s;

  // Inner glow (white-yellow core)
  const glowA = 0.2 + Math.sin(t * 3) * 0.08;
  g.ellipse(cx, bodyCenter, bodyW * 0.7, bodyH * 0.6)
    .fill({ color: 0xffffff, alpha: glowA * 0.5 });
  g.ellipse(cx, bodyCenter, bodyW * 0.85, bodyH * 0.7)
    .fill({ color: 0xffeb3b, alpha: glowA * 0.4 });

  // Flame spikes — 10-14 spikes radiating outward, mostly upward
  const spikeCount = 12;
  for (let i = 0; i < spikeCount; i++) {
    const baseAngle = (i / spikeCount) * Math.PI * 2 - Math.PI / 2; // start from top
    // Animate each spike independently
    const wobble = Math.sin(t * 4 + i * 1.7) * 0.15;
    const angle = baseAngle + wobble;

    // Spikes pointing up are longer
    const upFactor = Math.max(0, -Math.sin(baseAngle)); // 1 at top, 0 at sides
    const baseLen = bodyH * (0.5 + upFactor * 0.6);
    const lenPulse = Math.sin(t * 5 + i * 2.3) * bodyH * 0.15;
    const length = baseLen + lenPulse;

    const spikeW = bodyW * (0.08 + Math.random() * 0.04);
    const spikeAlpha = 0.5 + Math.sin(t * 3 + i) * 0.15;

    // Outer spike (orange-red)
    drawSpike(g, cx, bodyCenter, angle, length, spikeW, 0xff6d00, spikeAlpha * 0.7);
    // Inner spike (yellow, shorter)
    drawSpike(g, cx, bodyCenter, angle, length * 0.65, spikeW * 0.7, 0xffeb3b, spikeAlpha * 0.5);
  }

  // Small rising spark particles
  if (Math.random() < 0.3) {
    const angle = Math.random() * Math.PI * 2;
    const dist = bodyW * 0.5 + Math.random() * bodyW * 0.3;
    ps.push({
      x: cx + Math.cos(angle) * dist,
      y: bodyCenter + bodyH * 0.3 + Math.random() * bodyH * 0.2,
      vx: (Math.random() - 0.5) * 0.1,
      vy: -(0.15 + Math.random() * 0.2) * (bodyH / 20),
      size: bodyW * 0.04 + Math.random() * bodyW * 0.06,
      life: 0, maxLife: 20 + Math.random() * 15,
      color: Math.random() < 0.4 ? 0xffeb3b : 0xff6d00,
      alpha: 0.8,
    });
  }

  for (let i = ps.length - 1; i >= 0; i--) {
    const p = ps[i];
    p.x += p.vx + Math.sin(p.life * 0.2) * 0.05;
    p.y += p.vy;
    p.size *= 0.96;
    p.life++;
    if (p.life >= p.maxLife || p.size < 0.15) { ps.splice(i, 1); continue; }
    const a = p.alpha * (1 - p.life / p.maxLife);
    g.circle(p.x, p.y, p.size).fill({ color: p.color, alpha: a });
  }
}

// ════════════════════════════════════════════
// ICE AURA — Swirling arc streaks + sparkles
// ════════════════════════════════════════════
export function renderIceAura(
  g: Graphics, ps: AuraParticle[], t: number, s: AuraScale,
) {
  const { cx, bodyCenter, bodyH, bodyW } = s;

  // Soft inner glow
  const glowA = 0.15 + Math.sin(t * 2) * 0.06;
  g.ellipse(cx, bodyCenter, bodyW * 0.8, bodyH * 0.65)
    .fill({ color: 0xe3f2fd, alpha: glowA });

  // Swirling arc streaks — 4-6 arcs orbiting at different radii and speeds
  const arcCount = 5;
  for (let i = 0; i < arcCount; i++) {
    const radius = bodyW * (0.7 + i * 0.2) + Math.sin(t * 1.5 + i) * bodyW * 0.1;
    const startAngle = t * (1.5 + i * 0.4) + (i * Math.PI * 2) / arcCount;
    const sweep = Math.PI * (0.4 + Math.sin(t * 2 + i * 1.3) * 0.15);
    const arcAlpha = 0.35 + Math.sin(t * 2.5 + i * 0.7) * 0.15;
    const width = bodyW * 0.06 + Math.sin(t * 3 + i) * bodyW * 0.02;

    // Main blue arc
    drawArc(g, cx, bodyCenter, radius, startAngle, sweep, 0x42a5f5, width, arcAlpha);
    // Brighter inner arc
    drawArc(g, cx, bodyCenter, radius * 0.95, startAngle + 0.1, sweep * 0.7, 0xbbdefb, width * 0.6, arcAlpha * 0.6);
  }

  // Additional shorter accent arcs
  for (let i = 0; i < 3; i++) {
    const radius = bodyW * (0.5 + i * 0.35);
    const startAngle = -t * (2 + i * 0.3) + i * 2.1; // reverse direction
    const sweep = Math.PI * 0.25;
    const arcAlpha = 0.2 + Math.sin(t * 3 + i * 1.1) * 0.1;
    drawArc(g, cx, bodyCenter, radius, startAngle, sweep, 0x90caf9, bodyW * 0.04, arcAlpha);
  }

  // Crystalline sparkle particles
  if (Math.random() < 0.12) {
    const angle = Math.random() * Math.PI * 2;
    const dist = bodyW * (0.6 + Math.random() * 0.6);
    ps.push({
      x: cx + Math.cos(angle) * dist,
      y: bodyCenter + Math.sin(angle) * bodyH * 0.4,
      vx: Math.cos(angle + Math.PI / 2) * 0.04,
      vy: -0.02 + Math.random() * 0.04,
      size: bodyW * 0.03 + Math.random() * bodyW * 0.05,
      life: 0, maxLife: 40 + Math.random() * 25,
      color: Math.random() < 0.3 ? 0xffffff : 0xbbdefb,
      alpha: 0.7,
    });
  }

  for (let i = ps.length - 1; i >= 0; i--) {
    const p = ps[i];
    p.x += p.vx + Math.sin(t * 3 + i) * 0.04;
    p.y += p.vy + Math.cos(t * 2 + i * 0.5) * 0.03;
    p.life++;
    if (p.life >= p.maxLife) { ps.splice(i, 1); continue; }
    const fade = p.life < 8 ? p.life / 8 : 1 - (p.life - 8) / (p.maxLife - 8);
    const a = p.alpha * Math.max(0, fade);
    // Diamond sparkle
    g.poly([p.x, p.y - p.size, p.x + p.size * 0.5, p.y, p.x, p.y + p.size, p.x - p.size * 0.5, p.y])
      .fill({ color: p.color, alpha: a });
  }
}

// ════════════════════════════════════════════
// LIGHTNING AURA — Electric field + bolts
// ════════════════════════════════════════════
export function renderLightningAura(
  g: Graphics, ps: AuraParticle[], t: number, s: AuraScale,
) {
  const { cx, bodyCenter, bodyH, bodyW } = s;

  // Flickering electric field
  const pulse = Math.random() < 0.08 ? 0.35 : 0.15 + Math.sin(t * 6) * 0.08;
  g.ellipse(cx, bodyCenter, bodyW * 0.85, bodyH * 0.7)
    .fill({ color: 0xffd600, alpha: pulse * 0.6 });
  g.ellipse(cx, bodyCenter, bodyW * 0.6, bodyH * 0.5)
    .fill({ color: 0xffffff, alpha: pulse * 0.25 });

  // Random lightning bolts — jagged lines from body outward
  const boltChance = Math.random();
  if (boltChance < 0.12) {
    const boltCount = boltChance < 0.03 ? 3 : 1;
    for (let b = 0; b < boltCount; b++) {
      const angle = Math.random() * Math.PI * 2;
      let bx = cx + Math.cos(angle) * bodyW * 0.3;
      let by = bodyCenter + Math.sin(angle) * bodyH * 0.2;
      const segments = 3 + Math.floor(Math.random() * 2);

      for (let seg = 0; seg < segments; seg++) {
        const nx = bx + Math.cos(angle) * (bodyW * 0.2) + (Math.random() - 0.5) * bodyW * 0.3;
        const ny = by + Math.sin(angle) * (bodyH * 0.15) + (Math.random() - 0.5) * bodyH * 0.15;
        g.moveTo(bx, by).lineTo(nx, ny).stroke({ color: 0xffd600, width: bodyW * 0.06 });
        g.moveTo(bx, by).lineTo(nx, ny).stroke({ color: 0xffffff, width: bodyW * 0.025 });
        bx = nx; by = ny;
      }
    }
  }

  // Electric sparks
  if (Math.random() < 0.15) {
    const angle = Math.random() * Math.PI * 2;
    const dist = bodyW * (0.5 + Math.random() * 0.5);
    ps.push({
      x: cx + Math.cos(angle) * dist,
      y: bodyCenter + Math.sin(angle) * bodyH * 0.3,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: bodyW * 0.03 + Math.random() * bodyW * 0.04,
      life: 0, maxLife: 6 + Math.random() * 6,
      color: Math.random() < 0.5 ? 0xffd600 : 0xffffff,
      alpha: 0.9,
    });
  }

  for (let i = ps.length - 1; i >= 0; i--) {
    const p = ps[i];
    p.x += p.vx; p.y += p.vy; p.life++;
    if (p.life >= p.maxLife) { ps.splice(i, 1); continue; }
    const a = p.alpha * (1 - p.life / p.maxLife);
    g.circle(p.x, p.y, p.size).fill({ color: p.color, alpha: a });
  }
}

// ════════════════════════════════════════════
// DARK AURA — Swirling purple wisps + dark spikes
// ════════════════════════════════════════════
export function renderDarkAura(
  g: Graphics, ps: AuraParticle[], t: number, s: AuraScale,
) {
  const { cx, bodyCenter, bodyH, bodyW } = s;

  // Pulsing dark shroud
  const glowA = 0.25 + Math.sin(t * 1.5) * 0.08;
  g.ellipse(cx, bodyCenter, bodyW + Math.sin(t) * 2, bodyH * 0.8 + Math.cos(t * 0.7) * 2)
    .fill({ color: 0x0d001a, alpha: glowA });
  g.ellipse(cx, bodyCenter, bodyW * 0.75, bodyH * 0.6)
    .fill({ color: 0x4a148c, alpha: glowA * 0.4 });

  // Dark energy spikes (fewer, more menacing)
  const spikeCount = 8;
  for (let i = 0; i < spikeCount; i++) {
    const baseAngle = (i / spikeCount) * Math.PI * 2 - Math.PI / 2;
    const wobble = Math.sin(t * 2.5 + i * 2.1) * 0.2;
    const angle = baseAngle + wobble;
    const upFactor = Math.max(0, -Math.sin(baseAngle));
    const length = bodyH * (0.35 + upFactor * 0.4) + Math.sin(t * 3.5 + i * 1.9) * bodyH * 0.1;
    const spikeW = bodyW * 0.06;
    const spikeAlpha = 0.3 + Math.sin(t * 2 + i * 1.5) * 0.12;

    drawSpike(g, cx, bodyCenter, angle, length, spikeW, 0x4a148c, spikeAlpha);
    drawSpike(g, cx, bodyCenter, angle, length * 0.5, spikeW * 0.6, 0x7b1fa2, spikeAlpha * 0.5);
  }

  // Shadow wisps orbiting
  if (Math.random() < 0.1) {
    const angle = Math.random() * Math.PI * 2;
    const dist = bodyW * (0.4 + Math.random() * 0.6);
    ps.push({
      x: cx + Math.cos(angle) * dist,
      y: bodyCenter + Math.sin(angle) * bodyH * 0.3,
      vx: Math.cos(angle + Math.PI / 2) * 0.06,
      vy: -0.05 - Math.random() * 0.06,
      size: bodyW * 0.06 + Math.random() * bodyW * 0.06,
      life: 0, maxLife: 35 + Math.random() * 25,
      color: Math.random() < 0.3 ? 0x7b1fa2 : 0x4a148c,
      alpha: 0.45,
    });
  }

  for (let i = ps.length - 1; i >= 0; i--) {
    const p = ps[i];
    const dx = p.x - cx, dy = p.y - bodyCenter;
    p.x += -dy * 0.025 + p.vx;
    p.y += dx * 0.025 + p.vy;
    p.size *= 0.995; p.life++;
    if (p.life >= p.maxLife) { ps.splice(i, 1); continue; }
    const fade = p.life < 6 ? p.life / 6 : 1 - (p.life - 6) / (p.maxLife - 6);
    const a = p.alpha * Math.max(0, fade);
    g.circle(p.x, p.y, p.size).fill({ color: p.color, alpha: a });
  }
}

// ════════════════════════════════════════════
// SUPER SAIYAN AURA — Intense golden spiky energy
// ════════════════════════════════════════════
export function renderSuperSaiyanAura(
  g: Graphics, ps: AuraParticle[], t: number, s: AuraScale,
) {
  const { cx, bodyCenter, bodyH, bodyW } = s;

  // Bright white-gold inner core
  const coreA = 0.3 + Math.sin(t * 4) * 0.1;
  g.ellipse(cx, bodyCenter, bodyW * 0.65, bodyH * 0.55)
    .fill({ color: 0xffffff, alpha: coreA * 0.5 });
  g.ellipse(cx, bodyCenter, bodyW * 0.8, bodyH * 0.65)
    .fill({ color: 0xfff9c4, alpha: coreA * 0.35 });

  // Flame-like spiky energy — 14-16 spikes, mostly upward bias
  const spikeCount = 15;
  for (let i = 0; i < spikeCount; i++) {
    const baseAngle = (i / spikeCount) * Math.PI * 2 - Math.PI / 2;
    const wobble = Math.sin(t * 5 + i * 1.3) * 0.18;
    const angle = baseAngle + wobble;

    // Strong upward bias
    const upFactor = Math.max(0, -Math.sin(baseAngle));
    const baseLen = bodyH * (0.55 + upFactor * 0.8);
    const lenPulse = Math.sin(t * 6 + i * 2.1) * bodyH * 0.2;
    const length = baseLen + lenPulse;

    const spikeW = bodyW * (0.07 + Math.random() * 0.03);
    const spikeAlpha = 0.55 + Math.sin(t * 4 + i * 1.1) * 0.15;

    // Outer spike (golden-yellow)
    drawSpike(g, cx, bodyCenter, angle, length, spikeW, 0xffd600, spikeAlpha * 0.65);
    // Mid spike (bright yellow)
    drawSpike(g, cx, bodyCenter, angle, length * 0.7, spikeW * 0.7, 0xffeb3b, spikeAlpha * 0.45);
    // Inner spike (white core)
    drawSpike(g, cx, bodyCenter, angle, length * 0.4, spikeW * 0.5, 0xffffff, spikeAlpha * 0.3);
  }

  // Rising energy particles
  if (Math.random() < 0.25) {
    const angle = Math.random() * Math.PI * 2;
    const dist = bodyW * (0.3 + Math.random() * 0.6);
    ps.push({
      x: cx + Math.cos(angle) * dist,
      y: bodyCenter + bodyH * 0.35 + Math.random() * bodyH * 0.15,
      vx: (Math.random() - 0.5) * 0.08,
      vy: -(0.2 + Math.random() * 0.25) * (bodyH / 20),
      size: bodyW * 0.03 + Math.random() * bodyW * 0.05,
      life: 0, maxLife: 20 + Math.random() * 12,
      color: Math.random() < 0.5 ? 0xffd600 : 0xffffff,
      alpha: 0.85,
    });
  }

  for (let i = ps.length - 1; i >= 0; i--) {
    const p = ps[i];
    p.x += p.vx + Math.sin(p.life * 0.25) * 0.05;
    p.y += p.vy;
    p.size *= 0.95;
    p.life++;
    if (p.life >= p.maxLife || p.size < 0.12) { ps.splice(i, 1); continue; }
    const a = p.alpha * (1 - p.life / p.maxLife);
    g.circle(p.x, p.y, p.size).fill({ color: p.color, alpha: a });
  }

  // Occasional energy ring burst
  if (Math.random() < 0.025) {
    const ringR = bodyW * (0.5 + Math.random() * 0.3);
    g.ellipse(cx, bodyCenter, ringR, ringR * 0.5)
      .stroke({ color: 0xffd600, width: bodyW * 0.04, alpha: 0.35 });
  }
}

// ════════════════════════════════════════════
// Dispatcher: pick aura render function by ID
// ════════════════════════════════════════════
export function renderAura(
  g: Graphics, ps: AuraParticle[], t: number, s: AuraScale, auraId: string,
) {
  if (auraId.includes("fire")) {
    renderFireAura(g, ps, t, s);
  } else if (auraId.includes("ice")) {
    renderIceAura(g, ps, t, s);
  } else if (auraId.includes("lightning")) {
    renderLightningAura(g, ps, t, s);
  } else if (auraId.includes("dark")) {
    renderDarkAura(g, ps, t, s);
  } else if (auraId.includes("supersaiyan") || auraId.includes("rainbow")) {
    renderSuperSaiyanAura(g, ps, t, s);
  }
}
