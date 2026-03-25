import React, { useRef, useEffect, useMemo } from "react";
import { Application, Graphics } from "pixi.js";
import type { EquippedItems } from "@/types/avatar";
import type { CharacterPose } from "@/types/classroom";
import { createSpriteCharacter, type SpriteCharacterState } from "@/lib/pixi/spriteCharacter";
import { SPRITE_FRAME_W, SPRITE_FRAME_H } from "@/lib/pixi/studentSpriteSheet";
import { renderAura, SPRITE_SCALE, type AuraParticle } from "@/lib/pixi/auraEffects";

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

// ── Sprite Aura using shared auraEffects module ──
function addSpriteAura(app: Application, auraId: string): () => void {
  const gfx = new Graphics();
  app.stage.addChildAt(gfx, 0);
  const particles: AuraParticle[] = [];
  let time = 0;

  const update = () => {
    time += app.ticker.deltaTime * 0.05;
    gfx.clear();
    renderAura(gfx, particles, time, SPRITE_SCALE, auraId);
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

export default SpriteAvatar;
