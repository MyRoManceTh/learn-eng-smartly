import React, { useRef, useEffect, useMemo } from "react";
import { Application } from "pixi.js";
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
      charRef.current?.destroy();
      charRef.current = null;
      appReadyRef.current = false;
      // Don't pass true — that removes the React-managed canvas from the DOM
      appRef.current?.destroy();
      appRef.current = null;
    };
  }, []); // App lifecycle = component lifecycle

  // Create / recreate sprite character when equipment changes
  useEffect(() => {
    if (!appReadyRef.current || !appRef.current) return;
    const app = appRef.current;

    // Destroy previous character
    if (charRef.current) {
      charRef.current.destroy();
      charRef.current = null;
    }

    const activePose = walking ? "walking" : pose;
    const character = createSpriteCharacter(app.ticker, activePose, equipped);
    character.setDirection(direction);
    app.stage.addChild(character.container);
    charRef.current = character;
  }, [equippedKey]);

  // Retry character creation if app wasn't ready when equippedKey first set
  useEffect(() => {
    if (charRef.current) return; // Already created
    const timer = setInterval(() => {
      if (!appReadyRef.current || !appRef.current) return;
      clearInterval(timer);
      const app = appRef.current;
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

export default SpriteAvatar;
