import React, { useRef, useEffect, useMemo } from "react";
import { Application, Container } from "pixi.js";
import { EquippedItems } from "@/types/avatar";
import { createPixelApp } from "@/lib/pixi/pixiSetup";
import {
  drawLineStickerCharacter,
  GRID_W,
  GRID_H,
  StickerEmotion,
} from "@/lib/pixi/drawLineStickerCharacter";
import {
  setupEvolutionEffects,
  setupRainbowShimmer,
} from "@/lib/pixi/animations";
import {
  setupStickerIdle,
  setupStickerBlink,
  setupStickerWalkCycle,
  playStickerEquipTransition,
  playStickerEmotionReaction,
  setupFloatingHearts,
} from "@/lib/pixi/stickerAnimations";

interface PixelAvatarProps {
  equipped: EquippedItems;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  evolutionStage?: number;
  walking?: boolean;
  direction?: "left" | "right";
  emotion?: StickerEmotion;
}

const INTERNAL_W = GRID_W; // 64
const INTERNAL_H = GRID_H; // 80

// CSS display sizes — pet is ~36-44px, character should be ~2x bigger
const SIZE_CONFIG = {
  sm: { cssWidth: 96, cssHeight: 120 },    // 1.5x — room (2x pet size)
  md: { cssWidth: 160, cssHeight: 200 },   // 2.5x — home page
  lg: { cssWidth: 256, cssHeight: 320 },   // 4x — avatar page
};

const PixelAvatar: React.FC<PixelAvatarProps> = ({
  equipped,
  size = "md",
  animated = false,
  evolutionStage = 1,
  walking = false,
  direction = "right",
  emotion = "idle",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const characterRef = useRef<Container | null>(null);
  const cleanupFnsRef = useRef<(() => void)[]>([]);
  const walkCleanupRef = useRef<(() => void) | null>(null);
  const prevEquippedRef = useRef<string>("");
  const prevEmotionRef = useRef<StickerEmotion>("idle");
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

      // Draw LINE sticker character
      drawLineStickerCharacter(character, equipped, INTERNAL_H, emotion);

      if (animated) {
        // Idle bounce + squash-stretch
        const cleanIdle = setupStickerIdle(character, app.ticker);
        cleanupFnsRef.current.push(cleanIdle);

        // Natural eye blink
        const cleanBlink = setupStickerBlink(character, app.ticker, equipped, emotion);
        cleanupFnsRef.current.push(cleanBlink);
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

      // Floating hearts for love emotion
      if (emotion === "love") {
        const cleanHearts = setupFloatingHearts(app.stage, app.ticker, INTERNAL_H);
        cleanupFnsRef.current.push(cleanHearts);
      }

      prevEquippedRef.current = equippedKey;
      prevEmotionRef.current = emotion;
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

    drawLineStickerCharacter(characterRef.current, equipped, INTERNAL_H, emotion);

    if (prevEquippedRef.current !== "") {
      playStickerEquipTransition(characterRef.current, appRef.current.ticker);
    }

    prevEquippedRef.current = equippedKey;
  }, [equippedKey, equipped, emotion]);

  // Update when emotion changes
  useEffect(() => {
    if (!initDoneRef.current || !appRef.current || !characterRef.current) return;
    if (emotion === prevEmotionRef.current) return;

    drawLineStickerCharacter(characterRef.current, equipped, INTERNAL_H, emotion);

    // Play reaction animation
    playStickerEmotionReaction(characterRef.current, appRef.current.ticker, emotion);

    prevEmotionRef.current = emotion;
  }, [emotion, equipped]);

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
      const cleanIdle = setupStickerIdle(character, app.ticker);
      cleanupFnsRef.current.push(cleanIdle);

      const cleanBlink = setupStickerBlink(character, app.ticker, equipped, emotion);
      cleanupFnsRef.current.push(cleanBlink);
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

    if (emotion === "love") {
      const cleanHearts = setupFloatingHearts(app.stage, app.ticker, INTERNAL_H);
      cleanupFnsRef.current.push(cleanHearts);
    }
  }, [evolutionStage, isRainbow, emotion]);

  // Walk cycle animation
  useEffect(() => {
    if (!initDoneRef.current || !appRef.current || !characterRef.current) return;

    walkCleanupRef.current?.();
    walkCleanupRef.current = null;

    if (walking) {
      const cleanup = setupStickerWalkCycle(
        characterRef.current,
        appRef.current.ticker,
        equipped,
        emotion,
      );
      walkCleanupRef.current = cleanup;
    }

    return () => {
      walkCleanupRef.current?.();
      walkCleanupRef.current = null;
    };
  }, [walking, equippedKey, emotion]);

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
      }}
    />
  );
};

export default PixelAvatar;
