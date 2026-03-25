import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { Application, Container } from "pixi.js";
import { EquippedItems } from "@/types/avatar";
import type { CharacterPose } from "@/types/classroom";
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
  setupAuraAnimation,
} from "@/lib/pixi/stickerAnimations";

interface PixelAvatarProps {
  equipped: EquippedItems;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  evolutionStage?: number;
  walking?: boolean;
  direction?: "left" | "right";
  emotion?: StickerEmotion;
  pose?: CharacterPose;
}

const INTERNAL_W = GRID_W; // 64
const INTERNAL_H = GRID_H; // 80

const SIZE_CONFIG = {
  sm: { cssWidth: 96, cssHeight: 120 },
  md: { cssWidth: 160, cssHeight: 200 },
  lg: { cssWidth: 256, cssHeight: 320 },
};

const PixelAvatar: React.FC<PixelAvatarProps> = ({
  equipped,
  size = "md",
  animated = false,
  evolutionStage = 1,
  walking = false,
  direction = "right",
  emotion = "idle",
  pose = "idle",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const characterRef = useRef<Container | null>(null);
  const cleanupFnsRef = useRef<(() => void)[]>([]);
  const walkCleanupRef = useRef<(() => void) | null>(null);
  const initDoneRef = useRef(false);

  // Use refs for latest values so ticker callbacks always see current state
  const equippedRef = useRef(equipped);
  const emotionRef = useRef(emotion);
  const poseRef = useRef(pose);
  equippedRef.current = equipped;
  emotionRef.current = emotion;
  poseRef.current = pose;

  // Debounced redraw to prevent multiple concurrent redraws
  const redrawTimerRef = useRef<number | null>(null);
  const redraw = useCallback((playTransition = false) => {
    if (redrawTimerRef.current) cancelAnimationFrame(redrawTimerRef.current);
    redrawTimerRef.current = requestAnimationFrame(() => {
      redrawTimerRef.current = null;
      if (!characterRef.current || !appRef.current) return;
      drawLineStickerCharacter(
        characterRef.current,
        equippedRef.current,
        INTERNAL_H,
        emotionRef.current,
        0,
        0,
        poseRef.current,
      );
      if (playTransition && appRef.current) {
        playStickerEquipTransition(characterRef.current, appRef.current.ticker);
      }
    });
  }, []);

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

      // Draw character (direct, no debounce for initial)
      drawLineStickerCharacter(character, equippedRef.current, INTERNAL_H, emotionRef.current, 0, 0, poseRef.current);

      if (animated) {
        const cleanIdle = setupStickerIdle(character, app.ticker);
        cleanupFnsRef.current.push(cleanIdle);

        // Blink uses refs so it always reads latest equipped/emotion/pose
        const cleanBlink = setupStickerBlinkWithRefs(
          character, app.ticker, equippedRef, emotionRef, poseRef,
        );
        cleanupFnsRef.current.push(cleanBlink);
      }

      if (evolutionStage > 1) {
        const cleanEvo = setupEvolutionEffects(app.stage, app.ticker, evolutionStage, INTERNAL_H);
        cleanupFnsRef.current.push(cleanEvo);
      }

      if (isRainbow) {
        const cleanRainbow = setupRainbowShimmer(app.stage, app.ticker, INTERNAL_H, INTERNAL_H / 260);
        cleanupFnsRef.current.push(cleanRainbow);
      }

      if (emotion === "love") {
        const cleanHearts = setupFloatingHearts(app.stage, app.ticker, INTERNAL_H);
        cleanupFnsRef.current.push(cleanHearts);
      }

      initDoneRef.current = true;
    };

    init();

    return () => {
      destroyed = true;
      if (redrawTimerRef.current) cancelAnimationFrame(redrawTimerRef.current);
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

  // Update character when equipped changes — debounced
  const prevEquippedKeyRef = useRef(equippedKey);
  useEffect(() => {
    if (!initDoneRef.current) return;
    if (equippedKey === prevEquippedKeyRef.current) return;
    const isFirstChange = prevEquippedKeyRef.current !== "";
    prevEquippedKeyRef.current = equippedKey;
    redraw(isFirstChange);
  }, [equippedKey, redraw]);

  // Update when emotion changes — debounced
  const prevEmotionRef = useRef(emotion);
  useEffect(() => {
    if (!initDoneRef.current) return;
    if (emotion === prevEmotionRef.current) return;
    prevEmotionRef.current = emotion;
    redraw(false);

    if (appRef.current && characterRef.current) {
      playStickerEmotionReaction(characterRef.current, appRef.current.ticker, emotion);
    }
  }, [emotion, redraw]);

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

      const cleanBlink = setupStickerBlinkWithRefs(
        character, app.ticker, equippedRef, emotionRef, poseRef,
      );
      cleanupFnsRef.current.push(cleanBlink);
    }

    if (evolutionStage > 1) {
      const cleanEvo = setupEvolutionEffects(app.stage, app.ticker, evolutionStage, INTERNAL_H);
      cleanupFnsRef.current.push(cleanEvo);
    }

    if (isRainbow) {
      const cleanRainbow = setupRainbowShimmer(app.stage, app.ticker, INTERNAL_H, INTERNAL_H / 260);
      cleanupFnsRef.current.push(cleanRainbow);
    }

    if (emotion === "love") {
      const cleanHearts = setupFloatingHearts(app.stage, app.ticker, INTERNAL_H);
      cleanupFnsRef.current.push(cleanHearts);
    }

    // Aura animation
    if (equipped.aura) {
      const cleanAura = setupAuraAnimation(app.stage, app.ticker, equipped.aura, INTERNAL_H);
      cleanupFnsRef.current.push(cleanAura);
    }
  }, [evolutionStage, isRainbow, emotion, pose, equipped.aura]);

  // Redraw when pose changes
  useEffect(() => {
    if (!initDoneRef.current) return;
    redraw(false);
  }, [pose, redraw]);

  // Walk cycle
  useEffect(() => {
    if (!initDoneRef.current || !appRef.current || !characterRef.current) return;

    walkCleanupRef.current?.();
    walkCleanupRef.current = null;

    if (walking) {
      const cleanup = setupStickerWalkCycle(
        characterRef.current,
        appRef.current.ticker,
        equippedRef.current,
        emotionRef.current,
        poseRef.current,
      );
      walkCleanupRef.current = cleanup;
    }

    return () => {
      walkCleanupRef.current?.();
      walkCleanupRef.current = null;
    };
  }, [walking, equippedKey, emotion, pose]);

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

/**
 * Blink animation that reads latest state from refs instead of closures.
 * Prevents stale equipped/emotion data from triggering unnecessary redraws.
 */
function setupStickerBlinkWithRefs(
  characterContainer: Container,
  ticker: import("pixi.js").Ticker,
  equippedRef: React.MutableRefObject<EquippedItems>,
  emotionRef: React.MutableRefObject<StickerEmotion>,
  poseRef: React.MutableRefObject<CharacterPose>,
): () => void {
  let elapsed = 0;
  let blinkFrame = 0;
  let nextBlinkAt = 180 + Math.random() * 180;
  let blinkPhase = -1;
  const BLINK_DURATION = 8;

  const update = (dt: import("pixi.js").Ticker) => {
    elapsed += dt.deltaTime;

    if (blinkPhase === -1) {
      if (elapsed >= nextBlinkAt) {
        blinkPhase = 0;
        elapsed = 0;
      }
      return;
    }

    blinkPhase += dt.deltaTime;
    const progress = blinkPhase / BLINK_DURATION;

    let newFrame: number;
    if (progress < 0.2) newFrame = 1;
    else if (progress < 0.5) newFrame = 2;
    else if (progress < 0.7) newFrame = 1;
    else newFrame = 0;

    if (newFrame !== blinkFrame) {
      blinkFrame = newFrame;
      // Read latest values from refs — no stale closures
      drawLineStickerCharacter(
        characterContainer,
        equippedRef.current,
        GRID_H,
        emotionRef.current,
        0,
        blinkFrame,
        poseRef.current,
      );
    }

    if (progress >= 1) {
      blinkPhase = -1;
      elapsed = 0;
      blinkFrame = 0;
      nextBlinkAt = 180 + Math.random() * 180;
      if (Math.random() < 0.2) nextBlinkAt = 15;
    }
  };

  ticker.add(update);
  return () => {
    ticker.remove(update);
    if (blinkFrame !== 0) {
      drawLineStickerCharacter(
        characterContainer,
        equippedRef.current,
        GRID_H,
        emotionRef.current,
        0,
        0,
        poseRef.current,
      );
    }
  };
}

export default PixelAvatar;
