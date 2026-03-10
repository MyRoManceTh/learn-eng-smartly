import React, { useRef, useEffect, useMemo } from "react";
import { Application, Container } from "pixi.js";
import { EquippedItems } from "@/types/avatar";
import { createPixelApp } from "@/lib/pixi/pixiSetup";
import { drawChibiCharacter } from "@/lib/pixi/drawChibiCharacter";
import {
  setupIdleAnimation,
  setupEvolutionEffects,
  setupRainbowShimmer,
  playEquipTransition,
} from "@/lib/pixi/animations";

interface PixelAvatarProps {
  equipped: EquippedItems;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  evolutionStage?: number;
}

// Internal (low-res) rendering size must match GRID_W x GRID_H in drawChibiCharacter.
// The 8-bit look comes from rendering at 17x23 then CSS upscaling with pixelated.
const INTERNAL_W = 17;
const INTERNAL_H = 23;

// CSS sizes are exact integer multiples for pixel-perfect scaling
const SIZE_CONFIG = {
  sm: { cssWidth: 102, cssHeight: 138 },   // 6x
  md: { cssWidth: 170, cssHeight: 230 },   // 10x
  lg: { cssWidth: 238, cssHeight: 322 },   // 14x
};

const PixelAvatar: React.FC<PixelAvatarProps> = ({
  equipped,
  size = "md",
  animated = false,
  evolutionStage = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const characterRef = useRef<Container | null>(null);
  const cleanupFnsRef = useRef<(() => void)[]>([]);
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
