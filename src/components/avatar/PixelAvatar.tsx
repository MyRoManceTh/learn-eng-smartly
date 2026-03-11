import React, { useRef, useEffect, useMemo } from "react";
import { Application, Container } from "pixi.js";
import { EquippedItems } from "@/types/avatar";
import { createPixelApp } from "@/lib/pixi/pixiSetup";
import { drawChibiCharacter, GRID_W, GRID_H } from "@/lib/pixi/drawChibiCharacter";
import {
  setupIdleAnimation,
  setupEvolutionEffects,
  setupRainbowShimmer,
  setupWalkCycle,
  playEquipTransition,
} from "@/lib/pixi/animations";

interface PixelAvatarProps {
  equipped: EquippedItems;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  evolutionStage?: number;
  walking?: boolean;
  direction?: "left" | "right";
}

// Internal rendering size must match GRID_W x GRID_H in drawChibiCharacter.
const INTERNAL_W = 48;
const INTERNAL_H = 64;

// CSS sizes are exact integer multiples for pixel-perfect scaling
const SIZE_CONFIG = {
  sm: { cssWidth: 96, cssHeight: 128 },    // 2x
  md: { cssWidth: 144, cssHeight: 192 },   // 3x
  lg: { cssWidth: 240, cssHeight: 320 },   // 5x
};

const PixelAvatar: React.FC<PixelAvatarProps> = ({
  equipped,
  size = "md",
  animated = false,
  evolutionStage = 1,
  walking = false,
  direction = "right",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const characterRef = useRef<Container | null>(null);
  const cleanupFnsRef = useRef<(() => void)[]>([]);
  const walkCleanupRef = useRef<(() => void) | null>(null);
  const prevEquippedRef = useRef<string>("");
  const initDoneRef = useRef(false);

  const config = SIZE_CONFIG[size];
  const equippedKey = useMemo(() => JSON.stringify(equipped), [equipped]);
  const isRainbow = equipped.hairColor === "haircolor_rainbow";

  // Initialize PixiJS app at LOW internal resolution
  useEffect(() => {
    let destroyed = false;

    const init = async () => {
      if (!canvasRef.current) return;

      // Render at 17x23 pixel grid size for true 8-bit pixel look
      const app = await createPixelApp(canvasRef.current, {
        width: INTERNAL_W,
        height: INTERNAL_H,
        transparent: true,
      });

      if (destroyed) {
        app.destroy(true);
        return;
      }

      appRef.current = app;

      const character = new Container();
      app.stage.addChild(character);
      characterRef.current = character;

      // Draw chibi on 17x23 pixel grid
      drawChibiCharacter(character, equipped, INTERNAL_H);

      if (animated) {
        const cleanIdle = setupIdleAnimation(character, app.ticker);
        cleanupFnsRef.current.push(cleanIdle);
      }

      if (evolutionStage > 1) {
        const cleanEvo = setupEvolutionEffects(
          app.stage, app.ticker, evolutionStage, INTERNAL_H
        );
        cleanupFnsRef.current.push(cleanEvo);
      }

      if (isRainbow) {
        const cleanRainbow = setupRainbowShimmer(
          app.stage, app.ticker, INTERNAL_H, INTERNAL_H / 260
        );
        cleanupFnsRef.current.push(cleanRainbow);
      }

      prevEquippedRef.current = equippedKey;
      initDoneRef.current = true;
    };

    init();

    return () => {
      destroyed = true;
      cleanupFnsRef.current.forEach((fn) => fn());
      cleanupFnsRef.current = [];
      walkCleanupRef.current?.();
      walkCleanupRef.current = null;
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
      characterRef.current = null;
      initDoneRef.current = false;
    };
  }, [animated]);

  // Update character when equipped changes
  useEffect(() => {
    if (!initDoneRef.current || !appRef.current || !characterRef.current) return;
    if (equippedKey === prevEquippedRef.current) return;

    drawChibiCharacter(characterRef.current, equipped, INTERNAL_H);

    if (prevEquippedRef.current !== "") {
      playEquipTransition(characterRef.current, appRef.current.ticker);
    }

    prevEquippedRef.current = equippedKey;
  }, [equippedKey, equipped]);

  // Update evolution effects when stage changes
  useEffect(() => {
    if (!initDoneRef.current || !appRef.current) return;

    const oldCleanups = cleanupFnsRef.current;
    cleanupFnsRef.current = [];
    oldCleanups.forEach((fn) => fn());

    const app = appRef.current;
    const character = characterRef.current;
    if (!character) return;

    if (animated) {
      const cleanIdle = setupIdleAnimation(character, app.ticker);
      cleanupFnsRef.current.push(cleanIdle);
    }

    if (evolutionStage > 1) {
      const cleanEvo = setupEvolutionEffects(
        app.stage, app.ticker, evolutionStage, INTERNAL_H
      );
      cleanupFnsRef.current.push(cleanEvo);
    }

    if (isRainbow) {
      const cleanRainbow = setupRainbowShimmer(
        app.stage, app.ticker, INTERNAL_H, INTERNAL_H / 260
      );
      cleanupFnsRef.current.push(cleanRainbow);
    }
  }, [evolutionStage, isRainbow]);

  // Walk cycle animation
  useEffect(() => {
    if (!initDoneRef.current || !appRef.current || !characterRef.current) return;

    // Cleanup previous walk cycle
    walkCleanupRef.current?.();
    walkCleanupRef.current = null;

    if (walking) {
      const cleanup = setupWalkCycle(
        characterRef.current,
        appRef.current.ticker,
        equipped,
        INTERNAL_H
      );
      walkCleanupRef.current = cleanup;
    }

    return () => {
      walkCleanupRef.current?.();
      walkCleanupRef.current = null;
    };
  }, [walking, equippedKey]);

  // Direction flip
  useEffect(() => {
    if (!characterRef.current) return;
    const character = characterRef.current;

    if (direction === "left") {
      character.scale.x = -1;
      character.x = GRID_W;
    } else {
      character.scale.x = 1;
      character.x = 0;
    }
  }, [direction]);

  return (
    <canvas
      ref={canvasRef}
      width={INTERNAL_W}
      height={INTERNAL_H}
      style={{
        width: config.cssWidth,
        height: config.cssHeight,
        imageRendering: "pixelated",
      }}
    />
  );
};

export default PixelAvatar;
