/**
 * PixiJS Sprite Character Manager
 *
 * Takes a sprite sheet canvas (from studentSpriteSheet.ts) and creates
 * an animated PixiJS character with pose switching.
 *
 * Supports EquippedItems via SpritePalette for dynamic colors
 * and equipment overlays (hair/hat/accessory).
 */

import { Container, Texture, Sprite, Ticker, Rectangle } from "pixi.js";
import type { CharacterPose } from "@/types/classroom";
import type { EquippedItems } from "@/types/avatar";
import {
  generateStudentSpriteSheet,
  SPRITE_FRAME_W,
  SPRITE_FRAME_H,
  type SpriteSheetData,
  type EquipmentOverlay,
} from "./studentSpriteSheet";
import {
  resolveSpritePalette,
  resolveHairStyle,
  resolveHatId,
  resolveHatColor,
  resolveAccessoryId,
  resolveAccessoryColor,
} from "./spriteColors";
import { getItemById } from "@/data/avatarItems";
import { numToHex, parseColor } from "./colorUtils";

/** Maps CharacterPose → sprite sheet animation name */
const POSE_ANIM_MAP: Record<CharacterPose, string> = {
  idle:    "idle",
  walking: "walk",
  sitting: "sit",
  reading: "read",
};

/** Animation speed per pose (seconds per frame) */
const ANIM_SPEED: Record<string, number> = {
  idle: 0.25,
  walk: 0.08,
  sit:  0.5,
  read: 0.35,
};

export interface SpriteCharacterState {
  container: Container;
  setPose: (pose: CharacterPose) => void;
  setDirection: (dir: "left" | "right") => void;
  destroy: () => void;
}

/** Cache sprite sheets by equipment key to avoid re-generating */
const _sheetCache = new Map<string, SpriteSheetData>();
const MAX_CACHE_SIZE = 10;

function getEquipKey(equipped?: EquippedItems): string {
  if (!equipped) return "__default__";
  return JSON.stringify(equipped);
}

function resolveEquipOverlay(equipped?: EquippedItems): EquipmentOverlay | null {
  if (!equipped) return null;

  const leftItem = equipped.leftHand ? getItemById(equipped.leftHand) : null;
  const rightItem = equipped.rightHand ? getItemById(equipped.rightHand) : null;

  return {
    hairStyle: resolveHairStyle(equipped),
    hatId: resolveHatId(equipped),
    hatColor: resolveHatColor(equipped),
    accessoryId: resolveAccessoryId(equipped),
    accessoryColor: resolveAccessoryColor(equipped),
    leftHandId: equipped.leftHand || null,
    leftHandColor: leftItem ? numToHex(parseColor(leftItem.svgProps?.color || "#80DEEA")) : "#80DEEA",
    rightHandId: equipped.rightHand || null,
    rightHandColor: rightItem ? numToHex(parseColor(rightItem.svgProps?.color || "#90A4AE")) : "#90A4AE",
  };
}

function getSpriteSheet(equipped?: EquippedItems): SpriteSheetData {
  const key = getEquipKey(equipped);

  const cached = _sheetCache.get(key);
  if (cached) return cached;

  // Generate new sheet
  const palette = equipped ? resolveSpritePalette(equipped) : undefined;
  const overlay = resolveEquipOverlay(equipped);
  const sheet = generateStudentSpriteSheet(palette, overlay);

  // Evict oldest if cache is full
  if (_sheetCache.size >= MAX_CACHE_SIZE) {
    const firstKey = _sheetCache.keys().next().value;
    if (firstKey !== undefined) _sheetCache.delete(firstKey);
  }
  _sheetCache.set(key, sheet);

  return sheet;
}

/**
 * Create a sprite-based animated character.
 * Returns a container + control functions.
 */
export function createSpriteCharacter(
  ticker: Ticker,
  initialPose: CharacterPose = "idle",
  equipped?: EquippedItems,
): SpriteCharacterState {
  const sheet = getSpriteSheet(equipped);
  const container = new Container();

  // Extract frame textures from the sprite sheet canvas
  const baseTexture = Texture.from(sheet.canvas);
  const frameTextures: Record<string, Texture[]> = {};

  for (const [animName, animDef] of Object.entries(sheet.animations)) {
    const textures: Texture[] = [];
    for (let i = 0; i < animDef.frameCount; i++) {
      const frameIndex = animDef.startFrame + i;
      const x = frameIndex * sheet.frameWidth;
      const tex = new Texture({
        source: baseTexture.source,
        frame: new Rectangle(x, 0, sheet.frameWidth, sheet.frameHeight),
      });
      textures.push(tex);
    }
    frameTextures[animName] = textures;
  }

  // Current animation state
  let currentAnim = POSE_ANIM_MAP[initialPose];
  let currentFrameIdx = 0;
  let elapsed = 0;
  let destroyed = false;

  // The display sprite
  const sprite = new Sprite(frameTextures[currentAnim][0]);
  sprite.anchor.set(0.5, 1); // anchor at bottom-center
  sprite.x = SPRITE_FRAME_W / 2;
  sprite.y = SPRITE_FRAME_H;
  container.addChild(sprite);

  // Animation ticker callback
  const tickFn = () => {
    if (destroyed) return;
    const speed = ANIM_SPEED[currentAnim] || 0.2;
    elapsed += ticker.deltaMS / 1000;

    if (elapsed >= speed) {
      elapsed -= speed;
      const frames = frameTextures[currentAnim];
      if (frames && frames.length > 0) {
        currentFrameIdx = (currentFrameIdx + 1) % frames.length;
        sprite.texture = frames[currentFrameIdx];
      }
    }
  };
  ticker.add(tickFn);

  function setPose(pose: CharacterPose) {
    const newAnim = POSE_ANIM_MAP[pose];
    if (newAnim === currentAnim) return;
    currentAnim = newAnim;
    currentFrameIdx = 0;
    elapsed = 0;
    const frames = frameTextures[currentAnim];
    if (frames && frames[0]) {
      sprite.texture = frames[0];
    }
  }

  function setDirection(dir: "left" | "right") {
    sprite.scale.x = dir === "left" ? -1 : 1;
  }

  function destroy() {
    destroyed = true;
    ticker.remove(tickFn);
    container.destroy({ children: true });
  }

  // Set initial pose
  setPose(initialPose);

  return { container, setPose, setDirection, destroy };
}
