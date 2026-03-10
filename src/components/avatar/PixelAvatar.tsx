import React, { useRef, useEffect, useMemo } from "react";
import { Application, Container } from "pixi.js";
import { EquippedItems } from "@/types/avatar";
import { createPixelApp } from "@/lib/pixi/pixiSetup";
import { drawPixelCharacter } from "@/lib/pixi/drawCharacter";
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

const SIZE_CONFIG = {
  sm: { canvasSize: 96, pixelSize: 3 },   // 32 * 3 = 96
  md: { canvasSize: 160, pixelSize: 5 },   // 32 * 5 = 160
  lg: { canvasSize: 224, pixelSize: 7 },   // 32 * 7 = 224
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

  // Initialize PixiJS app
  useEffect(() => {
    let destroyed = false;

    const init = async () => {
      if (!canvasRef.current) return;

      const app = await createPixelApp(canvasRef.current, {
        width: config.canvasSize,
        height: config.canvasSize,
        transparent: true,
      });

      if (destroyed) {
        app.destroy(true);
        return;
      }

      appRef.current = app;

      // Create character container
      const character = new Container();
      app.stage.addChild(character);
      characterRef.current = character;

      // Draw initial character
      drawPixelCharacter(character, equipped, config.pixelSize);

      // Setup idle animation
      if (animated) {
        const cleanIdle = setupIdleAnimation(character, app.ticker);
        cleanupFnsRef.current.push(cleanIdle);
      }

      // Setup evolution effects
      if (evolutionStage > 1) {
        const cleanEvo = setupEvolutionEffects(
          app.stage,
          app.ticker,
          evolutionStage,
          config.canvasSize
        );
        cleanupFnsRef.current.push(cleanEvo);
      }

      // Setup rainbow shimmer
      if (isRainbow) {
        const cleanRainbow = setupRainbowShimmer(
          app.stage,
          app.ticker,
          config.canvasSize,
          config.pixelSize
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
  }, [config.canvasSize, config.pixelSize, animated]);

  // Update character when equipped changes
  useEffect(() => {
    if (!initDoneRef.current || !appRef.current || !characterRef.current) return;
    if (equippedKey === prevEquippedRef.current) return;

    drawPixelCharacter(characterRef.current, equipped, config.pixelSize);

    // Play transition effect
    if (prevEquippedRef.current !== "") {
      playEquipTransition(characterRef.current, appRef.current.ticker);
    }

    prevEquippedRef.current = equippedKey;
  }, [equippedKey, config.pixelSize, equipped]);

  // Update evolution effects when stage changes
  useEffect(() => {
    if (!initDoneRef.current || !appRef.current) return;

    // Remove old evolution effects (they are the last cleanup functions)
    // We re-add them fresh
    const oldCleanups = cleanupFnsRef.current;
    cleanupFnsRef.current = [];

    // Keep idle animation cleanup (first one if animated)
    // Clean all and re-setup
    oldCleanups.forEach((fn) => fn());

    const app = appRef.current;
    const character = characterRef.current;
    if (!character) return;

    // Re-setup idle
    if (animated) {
      const cleanIdle = setupIdleAnimation(character, app.ticker);
      cleanupFnsRef.current.push(cleanIdle);
    }

    // Re-setup evolution
    if (evolutionStage > 1) {
      const cleanEvo = setupEvolutionEffects(
        app.stage,
        app.ticker,
        evolutionStage,
        config.canvasSize
      );
      cleanupFnsRef.current.push(cleanEvo);
    }

    // Re-setup rainbow
    if (isRainbow) {
      const cleanRainbow = setupRainbowShimmer(
        app.stage,
        app.ticker,
        config.canvasSize,
        config.pixelSize
      );
      cleanupFnsRef.current.push(cleanRainbow);
    }
  }, [evolutionStage, isRainbow]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: config.canvasSize,
        height: config.canvasSize,
        imageRendering: "pixelated",
      }}
    />
  );
};

export default PixelAvatar;
