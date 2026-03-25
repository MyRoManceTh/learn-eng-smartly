import React, { useRef, useEffect, useMemo } from "react";
import { Application, Graphics, Container } from "pixi.js";
import type { EquippedItems } from "@/types/avatar";
import type { CharacterPose } from "@/types/classroom";
import { createSpriteCharacter, type SpriteCharacterState } from "@/lib/pixi/spriteCharacter";
import { SPRITE_FRAME_W, SPRITE_FRAME_H } from "@/lib/pixi/studentSpriteSheet";

interface SpriteAvatarProps {
  equipped?: EquippedItems;
  size?: "sm" | "md" | "lg";
  walking?: boolean;
  direction?: "left" | "right";
  pose?: CharacterPose;
}

/** CSS display sizes — 3× integer scale of 32×40 sprite */
const SIZE_CONFIG = {
  sm: { cssWidth: 96,  cssHeight: 120 },
  md: { cssWidth: 128, cssHeight: 160 },
  lg: { cssWidth: 192, cssHeight: 240 },
};

// ── Aura particle type ──
interface AuraP {
  x: number; y: number; vx: number; vy: number;
  size: number; life: number; maxLife: number;
  color: number; alpha: number;
}

const SpriteAvatar: React.FC<SpriteAvatarProps> = ({
  equipped,
  size = "md",
  walking = false,
  direction = "right",
  pose = "idle",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const charRef = useRef<SpriteCharacterState | null>(null);
  const auraCleanupRef = useRef<(() => void) | null>(null);
  const appReadyRef = useRef(false);

  const config = SIZE_CONFIG[size];
  const equippedKey = useMemo(() => equipped ? JSON.stringify(equipped) : "", [equipped]);

  // Initialize PixiJS Application once on mount, destroy on unmount
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (!canvasRef.current) return;

      const app = new Application();
      await app.init({
        canvas: canvasRef.current,
        width: SPRITE_FRAME_W,
        height: SPRITE_FRAME_H,
        backgroundAlpha: 0,
        antialias: false,
        resolution: 1,
      });

      if (cancelled) {
        app.destroy();
        return;
      }

      appRef.current = app;
      appReadyRef.current = true;
    };

    init();

    return () => {
      cancelled = true;
      auraCleanupRef.current?.();
      auraCleanupRef.current = null;
      charRef.current?.destroy();
      charRef.current = null;
      appReadyRef.current = false;
      appRef.current?.destroy();
      appRef.current = null;
    };
  }, []);

  // Create / recreate sprite character when equipment changes
  useEffect(() => {
    if (!appReadyRef.current || !appRef.current) return;
    const app = appRef.current;

    // Destroy previous
    auraCleanupRef.current?.();
    auraCleanupRef.current = null;
    if (charRef.current) {
      charRef.current.destroy();
      charRef.current = null;
    }

    // Add aura FIRST (behind character)
    const auraId = equipped?.aura;
    if (auraId) {
      auraCleanupRef.current = addSpriteAura(app, auraId);
    }

    const activePose = walking ? "walking" : pose;
    const character = createSpriteCharacter(app.ticker, activePose, equipped);
    character.setDirection(direction);
    app.stage.addChild(character.container);
    charRef.current = character;
  }, [equippedKey]);

  // Retry character creation if app wasn't ready when equippedKey first set
  useEffect(() => {
    if (charRef.current) return;
    const timer = setInterval(() => {
      if (!appReadyRef.current || !appRef.current) return;
      clearInterval(timer);
      const app = appRef.current;

      // Aura
      const auraId = equipped?.aura;
      if (auraId) {
        auraCleanupRef.current = addSpriteAura(app, auraId);
      }

      const activePose = walking ? "walking" : pose;
      const character = createSpriteCharacter(app.ticker, activePose, equipped);
      character.setDirection(direction);
      app.stage.addChild(character.container);
      charRef.current = character;
    }, 50);
    return () => clearInterval(timer);
  }, [equippedKey]);

  // Update pose
  useEffect(() => {
    if (!charRef.current) return;
    const activePose = walking ? "walking" : pose;
    charRef.current.setPose(activePose);
  }, [pose, walking]);

  // Update direction
  useEffect(() => {
    if (!charRef.current) return;
    charRef.current.setDirection(direction);
  }, [direction]);

  return (
    <canvas
      ref={canvasRef}
      width={SPRITE_FRAME_W}
      height={SPRITE_FRAME_H}
      style={{
        width: config.cssWidth,
        height: config.cssHeight,
        imageRendering: "pixelated",
      }}
    />
  );
};

// ════════════════════════════════════════════
// Sprite Aura Effect (32×40 canvas scale)
// ════════════════════════════════════════════

function addSpriteAura(app: Application, auraId: string): () => void {
  const gfx = new Graphics();
  // Add at index 0 so it renders behind the character sprite
  app.stage.addChildAt(gfx, 0);
  
  const particles: AuraP[] = [];
  let time = 0;

  // Center and body position for 32×40 sprite
  const CX = 16;
  const BODY_TOP = 18;

  const update = () => {
    time += app.ticker.deltaTime * 0.05;
    gfx.clear();

    if (auraId.includes("fire")) {
      renderFireAura(gfx, particles, time, CX, BODY_TOP, app.ticker.deltaTime);
    } else if (auraId.includes("ice")) {
      renderIceAura(gfx, particles, time, CX, BODY_TOP, app.ticker.deltaTime);
    } else if (auraId.includes("lightning")) {
      renderLightningAura(gfx, particles, time, CX, BODY_TOP, app.ticker.deltaTime);
    } else if (auraId.includes("dark")) {
      renderDarkAura(gfx, particles, time, CX, BODY_TOP, app.ticker.deltaTime);
    } else if (auraId.includes("supersaiyan") || auraId.includes("rainbow")) {
      renderSuperSaiyanAura(gfx, particles, time, CX, BODY_TOP, app.ticker.deltaTime);
    }
  };

  app.ticker.add(update);

  return () => {
    app.ticker.remove(update);
    if (gfx.parent) {
      gfx.parent.removeChild(gfx);
      gfx.destroy();
    }
  };
}

// ── Fire ──
function renderFireAura(g: Graphics, ps: AuraP[], t: number, cx: number, bt: number, dt: number) {
  const a = 0.25 + Math.sin(t * 3) * 0.1;
  g.ellipse(cx, bt + 4, 12 + Math.sin(t * 2) * 2, 16 + Math.sin(t * 2.5) * 1.5)
    .fill({ color: 0xff6d00, alpha: a });
  g.ellipse(cx, bt + 4, 8, 12)
    .fill({ color: 0xffeb3b, alpha: a * 0.6 });

  if (Math.random() < 0.25) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 4 + Math.random() * 6;
    ps.push({
      x: cx + Math.cos(angle) * dist, y: bt + 8 + Math.random() * 6,
      vx: (Math.random() - 0.5) * 0.1, vy: -0.2 - Math.random() * 0.15,
      size: 0.6 + Math.random() * 1, life: 0, maxLife: 20 + Math.random() * 15,
      color: Math.random() < 0.5 ? 0xff6d00 : 0xffab00, alpha: 0.8,
    });
  }

  for (let i = ps.length - 1; i >= 0; i--) {
    const p = ps[i];
    p.x += p.vx + Math.sin(p.life * 0.15) * 0.06;
    p.y += p.vy; p.size *= 0.97; p.life++;
    if (p.life >= p.maxLife || p.size < 0.2) { ps.splice(i, 1); continue; }
    const pa = p.alpha * (1 - p.life / p.maxLife);
    g.circle(p.x, p.y, p.size).fill({ color: p.color, alpha: pa });
  }
}

// ── Ice ──
function renderIceAura(g: Graphics, ps: AuraP[], t: number, cx: number, bt: number, dt: number) {
  const a = 0.2 + Math.sin(t * 2) * 0.08;
  g.ellipse(cx, bt + 4, 12 + Math.sin(t * 1.5) * 1.5, 16)
    .fill({ color: 0xb3e5fc, alpha: a });
  g.ellipse(cx, bt + 4, 8, 12)
    .fill({ color: 0xe3f2fd, alpha: a * 0.7 });

  if (Math.random() < 0.08) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 6 + Math.random() * 5;
    ps.push({
      x: cx + Math.cos(angle) * dist, y: bt - 2 + Math.random() * 16,
      vx: Math.cos(angle) * 0.03, vy: -0.03 + Math.random() * 0.06,
      size: 0.5 + Math.random() * 0.8, life: 0, maxLife: 40 + Math.random() * 20,
      color: Math.random() < 0.4 ? 0xe3f2fd : 0xb3e5fc, alpha: 0.7,
    });
  }

  for (let i = ps.length - 1; i >= 0; i--) {
    const p = ps[i];
    p.x += p.vx + Math.sin(t * 3 + i) * 0.05;
    p.y += p.vy + Math.cos(t * 2 + i * 0.5) * 0.03;
    p.life++;
    if (p.life >= p.maxLife) { ps.splice(i, 1); continue; }
    const fade = p.life < 8 ? p.life / 8 : 1 - (p.life - 8) / (p.maxLife - 8);
    const pa = p.alpha * Math.max(0, fade);
    g.poly([p.x, p.y - p.size, p.x + p.size * 0.5, p.y, p.x, p.y + p.size, p.x - p.size * 0.5, p.y])
      .fill({ color: p.color, alpha: pa });
  }
}

// ── Lightning ──
function renderLightningAura(g: Graphics, ps: AuraP[], t: number, cx: number, bt: number, dt: number) {
  const pulse = Math.random() < 0.1 ? 0.35 : 0.18 + Math.sin(t * 5) * 0.08;
  g.ellipse(cx, bt + 4, 12, 16).fill({ color: 0xffd600, alpha: pulse });
  g.ellipse(cx, bt + 4, 8, 12).fill({ color: 0xffffff, alpha: pulse * 0.3 });

  if (Math.random() < 0.06) {
    const angle = Math.random() * Math.PI * 2;
    const sx = cx + Math.cos(angle) * 8, sy = bt - 3 + Math.sin(angle) * 10;
    let bx = sx, by = sy;
    for (let seg = 0; seg < 2; seg++) {
      const nx = bx + (Math.random() - 0.5) * 4;
      const ny = by + 2 + Math.random() * 2;
      g.moveTo(bx, by).lineTo(nx, ny).stroke({ color: 0xffd600, width: 1 });
      g.moveTo(bx, by).lineTo(nx, ny).stroke({ color: 0xffffff, width: 0.4 });
      bx = nx; by = ny;
    }
  }

  if (Math.random() < 0.1) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 5 + Math.random() * 7;
    ps.push({
      x: cx + Math.cos(angle) * dist, y: bt + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
      size: 0.3 + Math.random() * 0.5, life: 0, maxLife: 6 + Math.random() * 6,
      color: Math.random() < 0.5 ? 0xffd600 : 0xffffff, alpha: 0.9,
    });
  }

  for (let i = ps.length - 1; i >= 0; i--) {
    const p = ps[i];
    p.x += p.vx; p.y += p.vy; p.life++;
    if (p.life >= p.maxLife) { ps.splice(i, 1); continue; }
    const pa = p.alpha * (1 - p.life / p.maxLife);
    g.circle(p.x, p.y, p.size).fill({ color: p.color, alpha: pa });
  }
}

// ── Dark ──
function renderDarkAura(g: Graphics, ps: AuraP[], t: number, cx: number, bt: number, dt: number) {
  const a = 0.25 + Math.sin(t * 1.5) * 0.08;
  g.ellipse(cx, bt + 4, 14 + Math.sin(t) * 2, 18 + Math.cos(t * 0.7) * 1.5)
    .fill({ color: 0x1a0033, alpha: a });
  g.ellipse(cx, bt + 4, 10, 14)
    .fill({ color: 0x7b1fa2, alpha: a * 0.5 });

  if (Math.random() < 0.08) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 4 + Math.random() * 8;
    ps.push({
      x: cx + Math.cos(angle) * dist, y: bt + 6 + Math.random() * 8,
      vx: Math.cos(angle + Math.PI / 2) * 0.05, vy: -0.06 - Math.random() * 0.06,
      size: 0.7 + Math.random() * 1, life: 0, maxLife: 30 + Math.random() * 20,
      color: Math.random() < 0.3 ? 0x7b1fa2 : 0x4a148c, alpha: 0.5,
    });
  }

  for (let i = ps.length - 1; i >= 0; i--) {
    const p = ps[i];
    const dx = p.x - cx, dy = p.y - (bt + 6);
    p.x += -dy * 0.02 + p.vx;
    p.y += dx * 0.02 + p.vy;
    p.size *= 0.995; p.life++;
    if (p.life >= p.maxLife) { ps.splice(i, 1); continue; }
    const fade = p.life < 6 ? p.life / 6 : 1 - (p.life - 6) / (p.maxLife - 6);
    const pa = p.alpha * Math.max(0, fade);
    g.circle(p.x, p.y, p.size).fill({ color: p.color, alpha: pa });
  }
}

// ── Super Saiyan ──
function renderSuperSaiyanAura(g: Graphics, ps: AuraP[], t: number, cx: number, bt: number, dt: number) {
  const p1 = 0.3 + Math.sin(t * 4) * 0.1;
  const p2 = 0.2 + Math.sin(t * 3 + 1) * 0.08;
  g.ellipse(cx, bt + 2, 14 + Math.sin(t * 2) * 2.5, 18 + Math.sin(t * 2.5) * 2)
    .fill({ color: 0xffd600, alpha: p1 });
  g.ellipse(cx, bt + 2, 10 + Math.sin(t * 3) * 1.5, 14 + Math.sin(t * 3) * 1.5)
    .fill({ color: 0xfff9c4, alpha: p2 });
  g.ellipse(cx, bt + 2, 7, 10)
    .fill({ color: 0xffffff, alpha: p2 * 0.4 });

  if (Math.random() < 0.18) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 3 + Math.random() * 9;
    ps.push({
      x: cx + Math.cos(angle) * dist, y: bt + 12 + Math.random() * 6,
      vx: (Math.random() - 0.5) * 0.06, vy: -0.25 - Math.random() * 0.2,
      size: 0.4 + Math.random() * 0.8, life: 0, maxLife: 18 + Math.random() * 10,
      color: Math.random() < 0.6 ? 0xffd600 : 0xffffff, alpha: 0.9,
    });
  }

  for (let i = ps.length - 1; i >= 0; i--) {
    const p = ps[i];
    p.x += p.vx + Math.sin(p.life * 0.2) * 0.05;
    p.y += p.vy; p.size *= 0.96; p.life++;
    if (p.life >= p.maxLife || p.size < 0.15) { ps.splice(i, 1); continue; }
    const pa = p.alpha * (1 - p.life / p.maxLife);
    g.circle(p.x, p.y, p.size).fill({ color: p.color, alpha: pa });
  }

  if (Math.random() < 0.015) {
    const rr = 6 + Math.random() * 4;
    g.ellipse(cx, bt + 3, rr, rr * 0.6)
      .stroke({ color: 0xffd600, width: 0.8, alpha: 0.3 });
  }
}

export default SpriteAvatar;
