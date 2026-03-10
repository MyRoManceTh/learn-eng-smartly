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

// Chibi characters are taller than wide, use rectangular canvas
const SIZE_CONFIG = {
  sm: { width: 100, height: 130 },
  md: { width: 160, height: 210 },
  lg: { width: 240, height: 310 },
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
        width: config.width,
        height: config.height,
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

      // Draw initial character (use height as the scaling base)
      drawChibiCharacter(character, equipped, config.height);

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
          Math.max(config.width, config.height)
        );
        cleanupFnsRef.current.push(cleanEvo);
      }

      // Setup rainbow shimmer
      if (isRainbow) {
        const cleanRainbow = setupRainbowShimmer(
          app.stage,
          app.ticker,
          config.height,
          config.height / 260 // approximate pixel scale
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
  }, [config.width, config.height, animated]);

  // Update character when equipped changes
  useEffect(() => {
    if (!initDoneRef.current || !appRef.current || !characterRef.current) return;
    if (equippedKey === prevEquippedRef.current) return;

    drawChibiCharacter(characterRef.current, equipped, config.height);

    // Play transition effect
    if (prevEquippedRef.current !== "") {
      playEquipTransition(characterRef.current, appRef.current.ticker);
    }

    prevEquippedRef.current = equippedKey;
  }, [equippedKey, config.height, equipped]);

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
        app.stage,
        app.ticker,
        evolutionStage,
        Math.max(config.width, config.height)
      );
      cleanupFnsRef.current.push(cleanEvo);
    }

    if (isRainbow) {
      const cleanRainbow = setupRainbowShimmer(
        app.stage,
        app.ticker,
        config.height,
        config.height / 260
      );
      cleanupFnsRef.current.push(cleanRainbow);
    }
  }, [evolutionStage, isRainbow]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: config.width,
        height: config.height,
        imageRendering: "auto",
      }}
    />
  );
};

export default PixelAvatar;
