import React, { useRef, useEffect } from "react";
import { Application } from "pixi.js";
import type { CharacterPose } from "@/types/classroom";
import { createSpriteCharacter, type SpriteCharacterState } from "@/lib/pixi/spriteCharacter";
import { SPRITE_FRAME_W, SPRITE_FRAME_H } from "@/lib/pixi/studentSpriteSheet";

interface SpriteAvatarProps {
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
  size = "md",
  walking = false,
  direction = "right",
  pose = "idle",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const charRef = useRef<SpriteCharacterState | null>(null);
  const initDoneRef = useRef(false);

  const config = SIZE_CONFIG[size];

  // Initialize PixiJS app + sprite character
  useEffect(() => {
    let destroyed = false;

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

      if (destroyed) {
        app.destroy(true);
        return;
      }

      appRef.current = app;

      const activePose = walking ? "walking" : pose;
      const character = createSpriteCharacter(app.ticker, activePose);
      character.setDirection(direction);
      app.stage.addChild(character.container);
      charRef.current = character;
      initDoneRef.current = true;
    };

    init();

    return () => {
      destroyed = true;
      charRef.current?.destroy();
      charRef.current = null;
      appRef.current?.destroy(true);
      appRef.current = null;
      initDoneRef.current = false;
    };
  }, []);

  // Update pose
  useEffect(() => {
    if (!initDoneRef.current || !charRef.current) return;
    const activePose = walking ? "walking" : pose;
    charRef.current.setPose(activePose);
  }, [pose, walking]);

  // Update direction
  useEffect(() => {
    if (!initDoneRef.current || !charRef.current) return;
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
